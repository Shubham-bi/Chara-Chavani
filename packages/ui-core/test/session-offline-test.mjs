import assert from 'node:assert';
import { SessionManager } from '../dist/storage/SessionManager.js';
import { OfflineActionQueue } from '../dist/offline/OfflineActionQueue.js';

console.log('🧪 Starting SessionManager & OfflineActionQueue Tests...');

// 1. Test SessionManager
const sessionMgr = new SessionManager();
assert.strictEqual(sessionMgr.isAuthenticated(), false, 'Session should initially be unauthenticated');
assert.strictEqual(sessionMgr.getAuthToken(), null, 'Initial auth token should be null');

await sessionMgr.setSession({
  token: 'ey-test-token-12345',
  userId: 42,
  role: 'Farmer',
  mobileNumber: '9890123456',
  displayName: 'Kisan Patil',
  isProfileCompleted: true,
  authenticatedAt: Date.now(),
});

assert.strictEqual(sessionMgr.isAuthenticated(), true, 'Session should be authenticated after setSession');
assert.strictEqual(sessionMgr.getAuthToken(), 'ey-test-token-12345', 'Auth token should match stored token');
assert.strictEqual(sessionMgr.getCurrentUser()?.displayName, 'Kisan Patil', 'Display name should match');

await sessionMgr.logout();
assert.strictEqual(sessionMgr.isAuthenticated(), false, 'Session should be unauthenticated after logout');
assert.strictEqual(sessionMgr.getAuthToken(), null, 'Auth token should be null after logout');
console.log('✅ SessionManager tests passed!');

// 2. Test OfflineActionQueue (Rule 9.6: "Do not perform offline animal admission without explicit backend validation")
const queue = new OfflineActionQueue();
assert.strictEqual(queue.getQueueLength(), 0, 'Initial queue should be empty');

// Draft animal registration is allowed offline
const draftAction = queue.enqueue('DRAFT_ANIMAL_REGISTRATION', {
  tagNumber: 'MH-20-4001',
  breed: 'Gir',
});
assert.strictEqual(queue.getQueueLength(), 1, 'Draft registration should be enqueued');
assert.strictEqual(draftAction.actionType, 'DRAFT_ANIMAL_REGISTRATION');

// Animal admission MUST throw error if attempted offline (Rule 9.6)
let threwAdmissionError = false;
try {
  queue.enqueue('ANIMAL_ADMISSION', { animalId: 101, campId: 1 });
} catch (e) {
  threwAdmissionError = true;
  assert.ok(e.message.includes('ERR_ONLINE_GEOFENCE_REQUIRED'), 'Error should contain ERR_ONLINE_GEOFENCE_REQUIRED');
}
assert.strictEqual(threwAdmissionError, true, 'Queue MUST reject offline animal admission per Rule 9.6');

// Replay queue
const result = await queue.processQueue(async (action) => {
  return true; // Simulate successful replay
});
assert.strictEqual(result.succeeded, 1, 'Draft action should be successfully replayed');
assert.strictEqual(queue.getQueueLength(), 0, 'Queue should be empty after processing');
console.log('✅ OfflineActionQueue Rule 9.6 compliance tests passed!');

console.log('🎉 All mobile architecture unit tests passed successfully!');
