/* eslint-disable no-undef */
/* eslint-disable no-template-curly-in-string */
/* global db print */
/* eslint no-restricted-globals: "off" */
/* eslint linebreak-style: ["error", "windows"] */

sai = db.issues.aggregate([
  {
    $group: {
      _id: '$owner',
      total_effort: { $sum: '$effort' },
      average_effort: { $avg: '$effort' },
    },
  },
]);

db.issues.aggregate([{ $group: { _id: null, count: { $sum: 1 } } }]);

db.issues.aggregate([
  { $match: { status: 'New' } },
  { $group: { _id: null, count: { $sum: 1 } } },
]);

db.issues.aggregate([
  {
    $group: {
      _id: { owner: '$owner', status: '$status' },
      count: { $sum: 1 },
    },
  },
]);

print(sai);
