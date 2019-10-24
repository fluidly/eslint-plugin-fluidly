# eslint-plugin-fluidly

Custom eslint plugins for the Fluidly codebase

```
{
  "rules": {
    "fluidly/no-new-date-for-parsing": 2,
  },
  "extends": [
    "plugin:fluidly/recommended"
  ],
  "plugins": [
    "fluidly"
  ]
}

```

## fluidly/no-new-date-for-parsing

Don't use `new Date(dateString)`, use `dateFns.parseISO(dateString)` instead. This is because `new Date('2019-01-01')` parses the date string as UCT and then converts to the local timezone. So `dateFns.format(new Date('2019-01-01'), 'yyyy MM dd')` would return `2018-12-31` if the user is in a timezone behind UCT (ie. Florida GMT-4/CDT).
