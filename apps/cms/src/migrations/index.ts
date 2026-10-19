import * as migration_20261019_201026_initial from './20261019_201026_initial';

export const migrations = [
  {
    up: migration_20261019_201026_initial.up,
    down: migration_20261019_201026_initial.down,
    name: '20261019_201026_initial',
  },
];
