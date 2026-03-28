import { toast } from 'sonner';

const waterPhrases = [
  { msg: 'Hydration unlocked', desc: 'Every sip counts toward your goal' },
  { msg: 'Water level rising', desc: 'Your body is loving this' },
  { msg: 'Staying sharp', desc: 'Hydration boosts focus & energy' },
  { msg: 'Flow state activated', desc: 'Keep the momentum going' },
  { msg: 'Refreshed & recharged', desc: 'One step closer to your goal' },
  { msg: 'Fueling your wellness', desc: 'Consistency is the key' },
  { msg: 'Splash logged', desc: 'You\'re building a healthy habit' },
  { msg: 'Hydration streak', desc: 'Your future self will thank you' },
];

const goalPhrases = [
  { msg: 'Goal crushed!', desc: 'You hit your daily target — amazing' },
  { msg: 'Champion status', desc: 'Daily hydration goal achieved' },
  { msg: 'Mission accomplished', desc: 'Consistency builds results' },
  { msg: 'Peak hydration', desc: 'You\'re performing at your best' },
  { msg: 'Target locked & hit', desc: 'Another day of great choices' },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function toastWaterAdded(amount) {
  const p = pick(waterPhrases);
  toast(p.msg, { description: `+${amount}ml — ${p.desc}`, duration: 2200 });
}

export function toastGoalReached() {
  const p = pick(goalPhrases);
  toast.success(p.msg, { description: p.desc, duration: 4000 });
}

export function toastReminderCreated() {
  toast.success('Reminder set', { description: 'We\'ll keep you on track', duration: 2000 });
}

export function toastReminderUpdated() {
  toast.success('Reminder updated', { description: 'Changes saved successfully', duration: 2000 });
}

export function toastReminderDeleted() {
  toast('Reminder removed', { description: 'You can always create a new one', duration: 1800 });
}

export function toastNoteCreated() {
  toast.success('Note captured', { description: 'Your thought is safely saved', duration: 2000 });
}

export function toastNoteUpdated() {
  toast.success('Changes saved', { description: 'Note updated successfully', duration: 1800 });
}

export function toastNoteDeleted() {
  toast('Note removed', { description: 'Gone but not forgotten', duration: 1800 });
}

export function toastAutoSaved() {
  toast('Auto-saved', { duration: 1200 });
}

export function toastError(msg) {
  toast.error('Oops', { description: msg, duration: 2500 });
}
