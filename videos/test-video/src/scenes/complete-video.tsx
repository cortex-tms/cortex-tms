import {makeScene2D, Txt, Rect, Layout, Circle} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#0a0a0a');

  // ========== SCENE 1: PROBLEM ==========
  const warning1 = createRef<Txt>();
  const text1 = createRef<Txt>();
  const tagline1 = createRef<Txt>();

  view.add(
    <>
      <Txt ref={warning1} fontSize={120} fill={'#f44336'} y={-150} opacity={0}>⚠️</Txt>
      <Txt ref={text1} fontSize={68} fill={'#ffffff'} fontWeight={700} textAlign={'center'} maxWidth={1600} lineHeight={90} opacity={0} y={50} />
      <Txt ref={tagline1} fontSize={42} fill={'#aaaaaa'} y={200} opacity={0}>There's a better way.</Txt>
    </>
  );

  yield* all(warning1().opacity(1, 0.3), warning1().scale(1.2, 0.3));
  yield* warning1().scale(1, 0.3);
  yield* waitFor(0.3);
  yield* all(text1().opacity(1, 0.5), text1().text('Tired of AI agents hallucinating\nproject conventions?', 1));
  yield* waitFor(1);
  yield* tagline1().opacity(1, 0.5);
  yield* waitFor(1.5);
  yield* all(text1().opacity(0, 0.5), warning1().opacity(0, 0.5), tagline1().opacity(0, 0.5));

  // ========== SCENE 2: SOLUTION ==========
  const title2 = createRef<Txt>();
  const subtitle2 = createRef<Txt>();
  const hotTier = createRef<Rect>();
  const warmTier = createRef<Rect>();
  const coldTier = createRef<Rect>();

  view.add(
    <>
      <Txt ref={title2} fontSize={70} fill={'#ffffff'} fontWeight={700} y={-400} opacity={0}>Cortex TMS</Txt>
      <Txt ref={subtitle2} fontSize={50} fill={'#f97316'} y={-320} opacity={0}>Tiered Memory System</Txt>
      <Rect ref={coldTier} width={750} height={130} fill={'#0ea5a4'} radius={12} y={180} opacity={0} shadowColor={'rgba(0, 0, 0, 0.4)'} shadowBlur={20}>
        <Txt fontSize={56} fill={'#ffffff'} fontWeight={700} y={-10}>COLD</Txt>
        <Txt fontSize={28} fill={'rgba(255, 255, 255, 0.9)'} y={30}>Archives, history</Txt>
      </Rect>
      <Rect ref={warmTier} width={600} height={130} fill={'#facc15'} radius={12} y={20} opacity={0} shadowColor={'rgba(0, 0, 0, 0.4)'} shadowBlur={20}>
        <Txt fontSize={56} fill={'#111111'} fontWeight={700} y={-10}>WARM</Txt>
        <Txt fontSize={28} fill={'rgba(0, 0, 0, 0.8)'} y={30}>Recent decisions</Txt>
      </Rect>
      <Rect ref={hotTier} width={500} height={130} fill={'#f97316'} radius={12} y={-140} opacity={0} shadowColor={'rgba(0, 0, 0, 0.4)'} shadowBlur={20}>
        <Txt fontSize={56} fill={'#ffffff'} fontWeight={700} y={-10}>HOT</Txt>
        <Txt fontSize={28} fill={'rgba(255, 255, 255, 0.9)'} y={30}>Active sprint, patterns</Txt>
      </Rect>
    </>
  );

  yield* title2().opacity(1, 0.5);
  yield* waitFor(0.2);
  yield* subtitle2().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* coldTier().opacity(1, 0.5);
  yield* waitFor(0.4);
  yield* warmTier().opacity(1, 0.5);
  yield* waitFor(0.4);
  yield* hotTier().opacity(1, 0.5);
  yield* waitFor(1);
  yield* all(hotTier().scale(1.08, 0.3), hotTier().shadowBlur(40, 0.3));
  yield* all(hotTier().scale(1.0, 0.3), hotTier().shadowBlur(20, 0.3));
  yield* waitFor(2);
  yield* all(title2().opacity(0, 0.5), subtitle2().opacity(0, 0.5), hotTier().opacity(0, 0.5), warmTier().opacity(0, 0.5), coldTier().opacity(0, 0.5));

  // ========== SCENE 3: VALUE ==========
  const title3 = createRef<Txt>();
  const benefit1 = createRef<Rect>();
  const benefit2 = createRef<Rect>();
  const benefit3 = createRef<Rect>();

  view.add(
    <>
      <Txt ref={title3} fontSize={64} fill={'#ffffff'} fontWeight={700} textAlign={'center'} lineHeight={80} y={-300} opacity={0}>
        Your AI reads only what matters.
      </Txt>
      <Rect ref={benefit1} width={1300} height={140} fill={'#1a1a1a'} radius={12} y={-80} opacity={0} shadowBlur={15}>
        <Layout layout direction={'row'} gap={40} alignItems={'center'}>
          <Txt fontSize={90} fill={'#f97316'}>⚡</Txt>
          <Txt fontSize={72} fill={'#f97316'} fontWeight={700}>Faster</Txt>
          <Txt fontSize={70} fill={'#20b2aa'}>✓</Txt>
        </Layout>
      </Rect>
      <Rect ref={benefit2} width={1300} height={140} fill={'#1a1a1a'} radius={12} y={100} opacity={0} shadowBlur={15}>
        <Layout layout direction={'row'} gap={40} alignItems={'center'}>
          <Txt fontSize={90} fill={'#facc15'}>💰</Txt>
          <Txt fontSize={72} fill={'#facc15'} fontWeight={700}>Cheaper</Txt>
          <Txt fontSize={70} fill={'#20b2aa'}>✓</Txt>
        </Layout>
      </Rect>
      <Rect ref={benefit3} width={1300} height={140} fill={'#1a1a1a'} radius={12} y={280} opacity={0} shadowBlur={15}>
        <Layout layout direction={'row'} gap={40} alignItems={'center'}>
          <Txt fontSize={90} fill={'#0ea5a4'}>🎯</Txt>
          <Txt fontSize={72} fill={'#0ea5a4'} fontWeight={700}>No drift</Txt>
          <Txt fontSize={70} fill={'#20b2aa'}>✓</Txt>
        </Layout>
      </Rect>
    </>
  );

  yield* title3().opacity(1, 0.5);
  yield* waitFor(0.5);
  benefit1().scale(0.9);
  yield* all(benefit1().opacity(1, 0.3), benefit1().scale(1, 0.3));
  yield* waitFor(1.2);
  benefit2().scale(0.9);
  yield* all(benefit2().opacity(1, 0.3), benefit2().scale(1, 0.3));
  yield* waitFor(1.2);
  benefit3().scale(0.9);
  yield* all(benefit3().opacity(1, 0.3), benefit3().scale(1, 0.3));
  yield* waitFor(2);
  yield* all(title3().opacity(0, 0.5), benefit1().opacity(0, 0.5), benefit2().opacity(0, 0.5), benefit3().opacity(0, 0.5));

  // ========== SCENE 4: TERMINAL ==========
  const terminal = createRef<Rect>();
  const cmd1 = createRef<Txt>();
  const out1 = createRef<Txt>();
  const cmd2 = createRef<Txt>();
  const outTitle = createRef<Txt>();
  const outLine1 = createRef<Txt>();
  const outLine2 = createRef<Txt>();
  const outLine3 = createRef<Txt>();

  view.add(
    <Rect ref={terminal} width={1650} height={850} fill={'#1a1a1a'} radius={16} shadowBlur={40} shadowOffsetY={15} padding={50} opacity={0}>
      <Layout layout direction={'column'} gap={25} alignItems={'start'} width={'100%'}>
        <Layout layout direction={'row'} gap={10} marginBottom={15} width={'100%'} justifyContent={'space-between'}>
          <Layout layout direction={'row'} gap={10}>
            <Circle size={16} fill={'#ff5f56'} />
            <Circle size={16} fill={'#ffbd2e'} />
            <Circle size={16} fill={'#27c93f'} />
          </Layout>
          <Txt fontSize={26} fill={'#666666'} fontFamily={'monospace'}>cortex-tms</Txt>
        </Layout>
        <Layout layout direction={'row'} gap={15}>
          <Txt fontSize={48} fill={'#666666'} fontFamily={'monospace'}>$</Txt>
          <Txt ref={cmd1} fontSize={48} fill={'#0ea5a4'} fontFamily={'monospace'} fontWeight={600} />
        </Layout>
        <Txt ref={out1} fontSize={42} fill={'#20b2aa'} fontFamily={'monospace'} opacity={0} marginLeft={60}>✓ Created 9 documentation files</Txt>
        <Layout height={35} />
        <Layout layout direction={'row'} gap={15}>
          <Txt fontSize={48} fill={'#666666'} fontFamily={'monospace'}>$</Txt>
          <Txt ref={cmd2} fontSize={48} fill={'#0ea5a4'} fontFamily={'monospace'} fontWeight={600} />
        </Layout>
        <Txt ref={outTitle} fontSize={44} fill={'#ffffff'} fontFamily={'monospace'} fontWeight={600} opacity={0} marginLeft={60}>💰 Context Savings (Estimate)</Txt>
        <Txt ref={outLine1} fontSize={40} fill={'#aaaaaa'} fontFamily={'monospace'} opacity={0} marginLeft={60}>{'  HOT tier (active): 32,450 tokens'}</Txt>
        <Txt ref={outLine2} fontSize={40} fill={'#aaaaaa'} fontFamily={'monospace'} opacity={0} marginLeft={60}>{'  Full repository: 101,234 tokens'}</Txt>
        <Txt ref={outLine3} fontSize={50} fill={'#f97316'} fontFamily={'monospace'} fontWeight={700} opacity={0} marginLeft={60}>{'  Reduction: 68%'}</Txt>
      </Layout>
    </Rect>
  );

  terminal().scale(0.95);
  yield* all(terminal().opacity(1, 0.5), terminal().scale(1, 0.5));
  yield* waitFor(0.3);
  yield* cmd1().text('cortex-tms init', 1.5);
  yield* waitFor(0.4);
  yield* out1().opacity(1, 0.3);
  yield* waitFor(1);
  yield* cmd2().text('cortex-tms status', 1.5);
  yield* waitFor(0.5);
  yield* outTitle().opacity(1, 0.3);
  yield* waitFor(0.4);
  yield* outLine1().opacity(1, 0.3);
  yield* waitFor(0.4);
  yield* outLine2().opacity(1, 0.3);
  yield* waitFor(0.4);
  yield* outLine3().opacity(1, 0.5);
  yield* outLine3().scale(1.1, 0.3);
  yield* outLine3().scale(1.0, 0.3);
  yield* waitFor(3);
  yield* terminal().opacity(0, 0.5);

  // ========== SCENE 5: CTA ==========
  const title5 = createRef<Txt>();
  const cmdBox = createRef<Rect>();
  const website = createRef<Txt>();
  const tagline5 = createRef<Txt>();

  view.add(
    <>
      <Txt ref={title5} fontSize={72} fill={'#ffffff'} fontWeight={700} y={-220} opacity={0}>Install now:</Txt>
      <Rect ref={cmdBox} width={1300} height={160} fill={'#1a1a1a'} radius={12} y={0} opacity={0} shadowBlur={30} shadowOffsetY={10}>
        <Txt fontSize={52} fill={'#0ea5a4'} fontFamily={'monospace'} fontWeight={700}>npm install -g cortex-tms</Txt>
      </Rect>
      <Txt ref={website} fontSize={64} fill={'#f97316'} fontWeight={600} y={220} opacity={0}>cortex-tms.org</Txt>
      <Txt ref={tagline5} fontSize={38} fill={'#aaaaaa'} y={310} opacity={0}>Tiered Memory for AI Agents</Txt>
    </>
  );

  yield* title5().opacity(1, 0.5);
  yield* waitFor(0.4);
  cmdBox().scale(0.95);
  yield* all(cmdBox().opacity(1, 0.5), cmdBox().scale(1, 0.5));
  yield* waitFor(0.5);
  yield* all(cmdBox().scale(1.05, 0.3), cmdBox().shadowBlur(40, 0.3));
  yield* all(cmdBox().scale(1.0, 0.3), cmdBox().shadowBlur(30, 0.3));
  yield* waitFor(0.5);
  yield* website().opacity(1, 0.5);
  yield* waitFor(0.3);
  yield* tagline5().opacity(1, 0.5);
  yield* waitFor(2.5);
  yield* all(title5().opacity(0, 0.5), cmdBox().opacity(0, 0.5), website().opacity(0, 0.5), tagline5().opacity(0, 0.5));
});
