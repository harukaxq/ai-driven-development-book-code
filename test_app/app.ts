function getFiveLaterDateTime(): Date {
  const now = new Date();
  now.setHours(now.getHours() + 5);
  return now;
}
