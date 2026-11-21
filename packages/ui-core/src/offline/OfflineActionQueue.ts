export interface QueuedAction<T = any> {
  id: string;
  actionType: string;
  payload: T;
  timestamp: number;
  retryCount: number;
  idempotencyKey: string;
}

export class OfflineActionQueue {
  private static instance: OfflineActionQueue;
  private queue: QueuedAction[] = [];
  private isProcessing = false;

  public static getInstance(): OfflineActionQueue {
    if (!OfflineActionQueue.instance) {
      OfflineActionQueue.instance = new OfflineActionQueue();
    }
    return OfflineActionQueue.instance;
  }

  /**
   * Enqueue action with strict compliance to Rule 9.6 of Development Guidelines:
   * "Do not perform offline animal admission without explicit backend validation."
   */
  public enqueue<T>(actionType: string, payload: T, idempotencyKey?: string): QueuedAction<T> {
    if (actionType === 'ANIMAL_ADMISSION' || actionType === 'ADMIT_ANIMAL') {
      throw new Error(
        'ERR_ONLINE_GEOFENCE_REQUIRED: Animal admission cannot be performed offline without live backend geofence verification.'
      );
    }

    const action: QueuedAction<T> = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actionType,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
      idempotencyKey: idempotencyKey || `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };

    this.queue.push(action);
    return action;
  }

  public getPendingActions(): QueuedAction[] {
    return [...this.queue];
  }

  public removeAction(id: string): void {
    this.queue = this.queue.filter(a => a.id !== id);
  }

  public clearQueue(): void {
    this.queue = [];
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Replay all pending actions through an executor callback.
   */
  public async processQueue(
    executor: (action: QueuedAction) => Promise<boolean>
  ): Promise<{ succeeded: number; failed: number }> {
    if (this.isProcessing || this.queue.length === 0) {
      return { succeeded: 0, failed: 0 };
    }

    this.isProcessing = true;
    let succeeded = 0;
    let failed = 0;

    const remaining: QueuedAction[] = [];

    for (const action of this.queue) {
      try {
        const success = await executor(action);
        if (success) {
          succeeded++;
        } else {
          action.retryCount++;
          remaining.push(action);
          failed++;
        }
      } catch (err) {
        action.retryCount++;
        remaining.push(action);
        failed++;
      }
    }

    this.queue = remaining;
    this.isProcessing = false;

    return { succeeded, failed };
  }
}

export const offlineActionQueue = OfflineActionQueue.getInstance();
