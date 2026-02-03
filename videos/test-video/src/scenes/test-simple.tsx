import {makeScene2D, Txt} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const text = createRef<Txt>();

  view.fill('#0a0a0a');

  view.add(
    <Txt
      ref={text}
      fontSize={80}
      fill={'#ffffff'}
      text=""
    />
  );

  yield* text().text('Hello Cortex TMS!', 1);
  yield* waitFor(2);
});
