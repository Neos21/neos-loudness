# @neos21/loudness : neos-loudness

[![NPM Version](https://img.shields.io/npm/v/@neos21/loudness.svg)](https://www.npmjs.com/package/@neos21/loudness) [![GPR Version](https://img.shields.io/github/package-json/v/neos21/neos-loudness?label=github)](https://github.com/Neos21/neos-loudness/packages/__ID__)

Loudness


## API

### `loudness.get()` : `Promise<number>`

- Returns : Volume ... `0` to `100`

### `loudness.set(volume)` : `Promise<{ volume: number, isMuted: boolean }>`

- Parameter 1 : Volume
  - `number | string` : `0` to `100`
- Returns : Volume Info
  - Property `volume` : `number` ... `0` to `100`
  - Property `isMuted` : `boolean` ... `true` or `false`

### `loudness.isMuted()` : `Promise<boolean>`

- Returns : Is Muted ... `true` or `false`

### `loudness.mute()` : `Promise<{ volume: number, isMuted: boolean }>`

- Returns : Volume Info

### `loudness.unmute()` : `Promise<{ volume: number, isMuted: boolean }>`

- Returns : Volume Info


## Links

- [Neo's World](https://neos21.net/)
- [GitHub - Neos21](https://github.com/Neos21/)
- [GitHub - neos-loudness](https://github.com/Neos21/neos-loudness)
- [npm - @neos21/loudness](https://www.npmjs.com/package/@neos21/loudness)
