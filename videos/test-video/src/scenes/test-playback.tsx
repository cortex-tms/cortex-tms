import {makeScene2D, Txt} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const text = createRef<Txt>();

  view.fill('#0a0a0a');

  view.add(
    <Txt
      ref={text}
      fontSize={100}
      fill={'#ffffff'}
      text="WORKING!"
    />
  );

  // Just wait - no animations
  yield* waitFor(3);

  yield* text().fill('#00ff00', 1);

  yield* waitFor(2);
});
