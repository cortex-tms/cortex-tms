import {makeProject} from '@motion-canvas/core';

// Individual scenes
import scene1Problem from './scenes/scene1-problem?scene';
import scene2Solution from './scenes/scene2-solution?scene';
import scene3Value from './scenes/scene3-value?scene';
import scene4Demo from './scenes/scene4-demo?scene';
import scene5Cta from './scenes/scene5-cta?scene';

// Complete video (all in one)
import heroVideo from './scenes/hero-video?scene';

export default makeProject({
  scenes: [
    // Use the complete video (comment out to use individual scenes)
    heroVideo,

    // OR use individual scenes (uncomment these)
    // scene1Problem,
    // scene2Solution,
    // scene3Value,
    // scene4Demo,
    // scene5Cta,
  ],
});
