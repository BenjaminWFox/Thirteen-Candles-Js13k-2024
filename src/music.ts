import { zzfx, zzfxX, zzfxP } from "./zzfx";
import { zzfxM } from "./zzfxm";

let audioContext = zzfxX;
let myAudioNode: any = null;

// const song = [[[.5, 0, 43, .01, , .3, 2, , , , , , , , , .02, .01], [.5, 0, 270, , , .12, 3, 1.65, -2, , , , , 4.5, , .02], [.5, 0, 2200, , , .04, 3, 2, , , 800, .02, , 4.8, , .01, .1], [1.8, , 10, .07, , .28, 3, , 36, , -30, .11, , .4, 276, , .4, .68, .38, .31], [.8, , 238, .05, .17, .03, 4, 3.3, -4, , , , , .7, 1.7, , .02, , .03, , -1329], [.5, , 52, .18, .19, .21, 1, 1.4, , , 418, .14, .18, .2, , , .39, .63, .24]], [[[, , 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33], [1, , , , 13, 13, , , , , 13, 13, 13, , , , , , , , 13, 13, , , , , 13, 13, 13, 13, 13, , , , , , 13, 13, , , , , 13, 13, 13, , , , , , , , 13, 13, , , , , 13, 13, 13, 13, 13, , , ,], [2, , , , , , 18, , , , , , 18, 18, , , 18, , , , , , 18, , , , , , , 18, 18, , , , 18, , , , 18, , , , , , 18, 18, , , , , 18, 18, , , 18, , , , 18, , , 18, 18, , , ,]]], [0], , { "title": "Sector13_Depp_Remix", "Notes": "Unknown author", "instruments": ["Instrument 1", "Instrument 3", "Instrument 6", "Instrument 8", "Instrument 14", "Instrument 15"], "patterns": ["Pattern 4"] }]
// const song = [[[.25, 0, 143, , , .35, 3], [3, 0, 43, , , .25, , , , , , , , 2], [.15, 0, 655, , , .11, 2, 1.65, , , , , , 3.8, -.1, .1]], [[[, , 6, 6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6, 6, 6], [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,], [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]], [[, , 9, 6, 11, 13, 6, 9, 11, 13, 11, 6, 9, 6, 13, 6, 9, 6], [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,], [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]], [[, , 30, 25, 28, 23, 30, 25, 28, 23, 30, 23, 25, 18, 23, 18, 25, 30], [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,], [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]], [[, , 6, 13, 23, 25, 6, 13, 23, 25, 11, 25, 30, 28, 30, 28, 23, 18], [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,], [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]], [[, , 11, 13, 18, 13, 11, 13, 18, 13, 6, 13, 11, 13, 18, 11, 13, 6], [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,], [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]], [[, , 13, 13, 11, 13, 18, 13, 18, 13, 13, 13, 11, 13, 6, 9, 13, 9], [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,], [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]]], [0, 1, 5, 1, 4, 2, 3, 0, 3, 2, 5, 4, 5], 120, { "title": "New Song", "instruments": ["Synth Brass", "Bass Drum 2", "Claps"], "patterns": ["Pattern 0", "Pattern 1", "Pattern 2", "Pattern 3", "Pattern 4", "Pattern 5"] }];
const song = [
  [
    [.2, 0, 143, , , .35, 3],
    [3, 0, 43, , , .25, , , , , , , , 2],
    [.15, 0, 655, , , .11, 2, 1.65, , , , , , 3.8, -.1, .1]],
  [
    [
      [, , 6, 6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6, 6, 6],
      [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,],
      [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]
    ],
    [
      [, , 9, 6, 11, 13, 6, 9, 11, 13, 11, 6, 9, 6, 13, 6, 9, 6],
      [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,],
      [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]
    ],
    [
      [, , 30, 25, 28, 23, 30, 25, 28, 23, 30, 23, 25, 18, 23, 18, 25, 30],
      [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,],
      [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]
    ],
    [
      [, , 6, 13, 23, 25, 6, 13, 23, 25, 11, 25, 30, 28, 30, 28, 23, 18],
      [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,],
      [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]
    ],
    [
      [, , 11, 13, 18, 13, 11, 13, 18, 13, 6, 13, 11, 13, 18, 11, 13, 6],
      [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,],
      [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]
    ],
    [
      [, , 13, 13, 11, 13, 18, 13, 18, 13, 13, 13, 11, 13, 6, 9, 13, 9],
      [1, , 6, , 6, , 6, , 6, , 6, , 6, , 6, , 6, ,],
      [2, 1, 11, , 11, 11, , 9, , 9, 9, , 13, , 13, 13, , ,]
    ]
  ],
  [0, 1, 5, 1, 4, 2, 3, 0, 3, 2, 5, 4, 5],
  110,
  {
    "title": "S",
    "instruments": ["Synth Brass", "Bass Drum 2", "Claps"],
    "patterns": ["Pattern 0", "Pattern 1", "Pattern 2", "Pattern 3", "Pattern 4", "Pattern 5"]
  }
];

export const sfx = (s: Array<number | undefined>) => zzfx(...s);

export function playSong() {
  if (myAudioNode) {
    audioContext.resume();
    return;
  }
  // @ts-ignore
  let mySongData = zzfxM(...song);
  myAudioNode = zzfxP(zzfxX, ...mySongData);
  myAudioNode.loop = true;
}
