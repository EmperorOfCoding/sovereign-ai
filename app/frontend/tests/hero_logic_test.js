/**
 * Simple Logic Test for Hero Video URL
 * This script simulates the logic used in Hero.tsx to ensure the video URL is correctly formatted.
 */

const processMock = {
  env: {
    NEXT_PUBLIC_MUX_VIDEO_URL: undefined
  }
};

function getHeroVideoUrl() {
  const baseVideoUrl = processMock.env.NEXT_PUBLIC_MUX_VIDEO_URL || 
    "https://player.mux.com/jZJwlj2JLC79VyxbQ61ORYe8n45xC1cFt82gvABrWeM";
  
  return `${baseVideoUrl}?metadata-video-title=Validate+Idea+AI+Video&video-title=Validate+Idea+AI+Video&autoplay=1&loop=1&muted=1&playsinline=1`;
}

const expected = "https://player.mux.com/jZJwlj2JLC79VyxbQ61ORYe8n45xC1cFt82gvABrWeM?metadata-video-title=Validate+Idea+AI+Video&video-title=Validate+Idea+AI+Video&autoplay=1&loop=1&muted=1&playsinline=1";
const actual = getHeroVideoUrl();

if (actual === expected) {
  console.log("✅ Video URL Logic Test Passed!");
} else {
  console.error("❌ Video URL Logic Test Failed!");
  console.error(`Expected: ${expected}`);
  console.error(`Actual:   ${actual}`);
  process.exit(1);
}
