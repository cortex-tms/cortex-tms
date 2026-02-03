import {makeScene2D, Txt, Rect, Layout, Circle} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const terminal = createRef<Rect>();
  const command1 = createRef<Txt>();
  const output1 = createRef<Txt>();
  const command2 = createRef<Txt>();
  const outputTitle = createRef<Txt>();
  const outputLine1 = createRef<Txt>();
  const outputLine2 = createRef<Txt>();
  const outputLine3 = createRef<Txt>();

  view.fill('#0a0a0a');

  view.add(
    <Rect
      ref={terminal}
      width={1650}
      height={850}
      fill={'#1a1a1a'}
      radius={16}
      shadowColor={'rgba(0, 0, 0, 0.6)'}
      shadowBlur={40}
      shadowOffsetY={15}
      padding={50}
      opacity={0}
    >
      <Layout layout direction={'column'} gap={25} alignItems={'start'} width={'100%'}>
        {/* Terminal header */}
        <Layout layout direction={'row'} gap={10} marginBottom={15} width={'100%'} justifyContent={'space-between'}>
          <Layout layout direction={'row'} gap={10}>
            <Circle size={16} fill={'#ff5f56'} />
            <Circle size={16} fill={'#ffbd2e'} />
            <Circle size={16} fill={'#27c93f'} />
          </Layout>
          <Txt fontSize={26} fill={'#666666'} fontFamily={'monospace'}>
            cortex-tms
          </Txt>
        </Layout>

        {/* Command 1 */}
        <Layout layout direction={'row'} gap={15}>
          <Txt fontSize={48} fill={'#666666'} fontFamily={'monospace'}>$</Txt>
          <Txt ref={command1} fontSize={48} fill={'#0ea5a4'} fontFamily={'monospace'} fontWeight={600} />
        </Layout>

        <Txt ref={output1} fontSize={42} fill={'#20b2aa'} fontFamily={'monospace'} opacity={0} marginLeft={60}>
          ✓ Created 9 documentation files
        </Txt>

        <Layout height={35} />

        {/* Command 2 */}
        <Layout layout direction={'row'} gap={15}>
          <Txt fontSize={48} fill={'#666666'} fontFamily={'monospace'}>$</Txt>
          <Txt ref={command2} fontSize={48} fill={'#0ea5a4'} fontFamily={'monospace'} fontWeight={600} />
        </Layout>

        {/* Status output */}
        <Txt ref={outputTitle} fontSize={44} fill={'#ffffff'} fontFamily={'monospace'} fontWeight={600} opacity={0} marginLeft={60}>
          💰 Context Savings (Estimate)
        </Txt>
        <Txt ref={outputLine1} fontSize={40} fill={'#aaaaaa'} fontFamily={'monospace'} opacity={0} marginLeft={60}>
          {'  HOT tier (active): 32,450 tokens'}
        </Txt>
        <Txt ref={outputLine2} fontSize={40} fill={'#aaaaaa'} fontFamily={'monospace'} opacity={0} marginLeft={60}>
          {'  Full repository: 101,234 tokens'}
        </Txt>
        <Txt ref={outputLine3} fontSize={50} fill={'#f97316'} fontFamily={'monospace'} fontWeight={700} opacity={0} marginLeft={60}>
          {'  Reduction: 68%'}
        </Txt>
      </Layout>
    </Rect>
  );

  // Terminal slides in
  terminal().scale(0.95);
  yield* all(
    terminal().opacity(1, 0.5),
    terminal().scale(1, 0.5),
  );
  yield* waitFor(0.3);

  // Type command 1
  yield* command1().text('cortex-tms init', 1.5);
  yield* waitFor(0.4);

  // Show output 1
  yield* output1().opacity(1, 0.3);
  yield* waitFor(1);

  // Type command 2
  yield* command2().text('cortex-tms status', 1.5);
  yield* waitFor(0.5);

  // Show status output
  yield* outputTitle().opacity(1, 0.3);
  yield* waitFor(0.4);
  yield* outputLine1().opacity(1, 0.3);
  yield* waitFor(0.4);
  yield* outputLine2().opacity(1, 0.3);
  yield* waitFor(0.4);

  // Emphasize reduction
  yield* outputLine3().opacity(1, 0.5);
  yield* outputLine3().scale(1.1, 0.3);
  yield* outputLine3().scale(1.0, 0.3);

  yield* waitFor(3);

  // Fade out
  yield* terminal().opacity(0, 0.5);
});
