import {makeScene2D, Txt, Rect, Layout, Circle, Img} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import logo from '../assets/logo.svg';

export default makeScene2D(function* (view) {
  view.fill('#0a0a0a');

  // ========== SCENE 1: PROBLEM (10s) ==========
  const logo1 = createRef<Img>();
  const warning = createRef<Txt>();
  const problemText = createRef<Txt>();
  const tagline = createRef<Txt>();

  view.add(
    <>
      <Img ref={logo1} src={logo} width={140} y={-400} opacity={0} />
      <Txt ref={warning} fontSize={120} fill={'#f44336'} y={-150} opacity={0}>⚠️</Txt>
      <Txt ref={problemText} fontSize={68} fill={'#ffffff'} fontWeight={700} textAlign={'center'} maxWidth={1600} lineHeight={90} opacity={0} y={50} text="" />
      <Txt ref={tagline} fontSize={42} fill={'#aaaaaa'} y={200} opacity={0} text="There's a better way." />
    </>
  );

  yield* logo1().opacity(1, 0.5);
  yield* waitFor(0.3);
  yield* all(warning().opacity(1, 0.3), warning().scale(1.2, 0.3));
  yield* warning().scale(1, 0.3);
  yield* waitFor(0.3);
  yield* all(problemText().opacity(1, 0.5), problemText().text('Tired of AI agents hallucinating\nproject conventions?', 1));
  yield* waitFor(1);
  yield* tagline().opacity(1, 0.5);
  yield* waitFor(1.5);
  yield* all(logo1().opacity(0, 0.5), problemText().opacity(0, 0.5), warning().opacity(0, 0.5), tagline().opacity(0, 0.5));
  yield* waitFor(0.3);

  // ========== SCENE 2: SOLUTION (10s) ==========
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const hot = createRef<Rect>();
  const warm = createRef<Rect>();
  const cold = createRef<Rect>();

  view.add(
    <>
      <Txt ref={title} fontSize={70} fill={'#ffffff'} fontWeight={700} y={-400} opacity={0} text="Cortex TMS" />
      <Txt ref={subtitle} fontSize={50} fill={'#f97316'} y={-320} opacity={0} text="Tiered Memory System" />
      <Rect ref={cold} width={750} height={130} fill={'#0ea5a4'} radius={12} y={180} opacity={0} shadowColor={'rgba(0,0,0,0.4)'} shadowBlur={20}>
        <Txt fontSize={56} fill={'#ffffff'} fontWeight={700} y={-10} text="COLD" />
        <Txt fontSize={28} fill={'rgba(255,255,255,0.9)'} y={30} text="Archives, history" />
      </Rect>
      <Rect ref={warm} width={600} height={130} fill={'#facc15'} radius={12} y={20} opacity={0} shadowColor={'rgba(0,0,0,0.4)'} shadowBlur={20}>
        <Txt fontSize={56} fill={'#111111'} fontWeight={700} y={-10} text="WARM" />
        <Txt fontSize={28} fill={'rgba(0,0,0,0.8)'} y={30} text="Recent decisions" />
      </Rect>
      <Rect ref={hot} width={500} height={130} fill={'#f97316'} radius={12} y={-140} opacity={0} shadowColor={'rgba(0,0,0,0.4)'} shadowBlur={20}>
        <Txt fontSize={56} fill={'#ffffff'} fontWeight={700} y={-10} text="HOT" />
        <Txt fontSize={28} fill={'rgba(255,255,255,0.9)'} y={30} text="Active sprint, patterns" />
      </Rect>
    </>
  );

  yield* title().opacity(1, 0.5);
  yield* waitFor(0.2);
  yield* subtitle().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cold().opacity(1, 0.5);
  yield* waitFor(0.4);
  yield* warm().opacity(1, 0.5);
  yield* waitFor(0.4);
  yield* hot().opacity(1, 0.5);
  yield* waitFor(1);
  yield* all(hot().scale(1.08, 0.3), hot().shadowBlur(40, 0.3));
  yield* all(hot().scale(1, 0.3), hot().shadowBlur(20, 0.3));
  yield* waitFor(2);
  yield* all(title().opacity(0, 0.5), subtitle().opacity(0, 0.5), hot().opacity(0, 0.5), warm().opacity(0, 0.5), cold().opacity(0, 0.5));
  yield* waitFor(0.3);

  // ========== SCENE 3: VALUE (15s) ==========
  const valueTitle = createRef<Txt>();
  const b1 = createRef<Rect>();
  const b2 = createRef<Rect>();
  const b3 = createRef<Rect>();

  view.add(
    <>
      <Txt ref={valueTitle} fontSize={64} fill={'#ffffff'} fontWeight={700} textAlign={'center'} lineHeight={80} y={-300} opacity={0} text="Your AI reads only what matters." />
      <Rect ref={b1} width={1300} height={140} fill={'#1a1a1a'} radius={12} y={-80} opacity={0} shadowBlur={15}>
        <Layout layout direction={'row'} gap={40} alignItems={'center'}>
          <Txt fontSize={90} fill={'#f97316'} text="⚡" />
          <Txt fontSize={72} fill={'#f97316'} fontWeight={700} text="Faster" />
          <Txt fontSize={70} fill={'#20b2aa'} text="✓" />
        </Layout>
      </Rect>
      <Rect ref={b2} width={1300} height={140} fill={'#1a1a1a'} radius={12} y={100} opacity={0} shadowBlur={15}>
        <Layout layout direction={'row'} gap={40} alignItems={'center'}>
          <Txt fontSize={90} fill={'#facc15'} text="💰" />
          <Txt fontSize={72} fill={'#facc15'} fontWeight={700} text="Cheaper" />
          <Txt fontSize={70} fill={'#20b2aa'} text="✓" />
        </Layout>
      </Rect>
      <Rect ref={b3} width={1300} height={140} fill={'#1a1a1a'} radius={12} y={280} opacity={0} shadowBlur={15}>
        <Layout layout direction={'row'} gap={40} alignItems={'center'}>
          <Txt fontSize={90} fill={'#0ea5a4'} text="🎯" />
          <Txt fontSize={72} fill={'#0ea5a4'} fontWeight={700} text="No drift" />
          <Txt fontSize={70} fill={'#20b2aa'} text="✓" />
        </Layout>
      </Rect>
    </>
  );

  yield* valueTitle().opacity(1, 0.5);
  yield* waitFor(0.5);
  b1().scale(0.9);
  yield* all(b1().opacity(1, 0.3), b1().scale(1, 0.3));
  yield* waitFor(1.2);
  b2().scale(0.9);
  yield* all(b2().opacity(1, 0.3), b2().scale(1, 0.3));
  yield* waitFor(1.2);
  b3().scale(0.9);
  yield* all(b3().opacity(1, 0.3), b3().scale(1, 0.3));
  yield* waitFor(2);
  yield* all(valueTitle().opacity(0, 0.5), b1().opacity(0, 0.5), b2().opacity(0, 0.5), b3().opacity(0, 0.5));
  yield* waitFor(0.3);

  // ========== SCENE 4: TERMINAL DEMO (15s) ==========
  const term = createRef<Rect>();
  const cmd1 = createRef<Txt>();
  const out1 = createRef<Txt>();
  const cmd2 = createRef<Txt>();
  const statTitle = createRef<Txt>();
  const stat1 = createRef<Txt>();
  const stat2 = createRef<Txt>();
  const stat3 = createRef<Txt>();

  view.add(
    <Rect ref={term} width={1650} height={850} fill={'#1a1a1a'} radius={16} shadowBlur={40} shadowOffsetY={15} padding={50} opacity={0}>
      <Layout layout direction={'column'} gap={25} alignItems={'start'} width={'100%'}>
        <Layout layout direction={'row'} gap={10} marginBottom={15} width={'100%'} justifyContent={'space-between'}>
          <Layout layout direction={'row'} gap={10}>
            <Circle size={16} fill={'#ff5f56'} />
            <Circle size={16} fill={'#ffbd2e'} />
            <Circle size={16} fill={'#27c93f'} />
          </Layout>
          <Txt fontSize={26} fill={'#666666'} fontFamily={'monospace'} text="cortex-tms" />
        </Layout>
        <Layout layout direction={'row'} gap={15}>
          <Txt fontSize={48} fill={'#666666'} fontFamily={'monospace'} text="$" />
          <Txt ref={cmd1} fontSize={48} fill={'#0ea5a4'} fontFamily={'monospace'} fontWeight={600} text="" />
        </Layout>
        <Txt ref={out1} fontSize={42} fill={'#20b2aa'} fontFamily={'monospace'} opacity={0} marginLeft={60} text="✓ Created 9 documentation files" />
        <Layout height={35} />
        <Layout layout direction={'row'} gap={15}>
          <Txt fontSize={48} fill={'#666666'} fontFamily={'monospace'} text="$" />
          <Txt ref={cmd2} fontSize={48} fill={'#0ea5a4'} fontFamily={'monospace'} fontWeight={600} text="" />
        </Layout>
        <Txt ref={statTitle} fontSize={44} fill={'#ffffff'} fontFamily={'monospace'} fontWeight={600} opacity={0} marginLeft={60} text="💰 Context Savings (Estimate)" />
        <Txt ref={stat1} fontSize={40} fill={'#aaaaaa'} fontFamily={'monospace'} opacity={0} marginLeft={60} text="  HOT tier (active): 32,450 tokens" />
        <Txt ref={stat2} fontSize={40} fill={'#aaaaaa'} fontFamily={'monospace'} opacity={0} marginLeft={60} text="  Full repository: 101,234 tokens" />
        <Txt ref={stat3} fontSize={50} fill={'#f97316'} fontFamily={'monospace'} fontWeight={700} opacity={0} marginLeft={60} text="  Reduction: 68%" />
      </Layout>
    </Rect>
  );

  term().scale(0.95);
  yield* all(term().opacity(1, 0.5), term().scale(1, 0.5));
  yield* waitFor(0.3);
  yield* cmd1().text('cortex-tms init', 1.5);
  yield* waitFor(0.4);
  yield* out1().opacity(1, 0.3);
  yield* waitFor(1);
  yield* cmd2().text('cortex-tms status', 1.5);
  yield* waitFor(0.5);
  yield* statTitle().opacity(1, 0.3);
  yield* waitFor(0.4);
  yield* stat1().opacity(1, 0.3);
  yield* waitFor(0.4);
  yield* stat2().opacity(1, 0.3);
  yield* waitFor(0.4);
  yield* stat3().opacity(1, 0.5);
  yield* stat3().scale(1.1, 0.3);
  yield* stat3().scale(1, 0.3);
  yield* waitFor(3);
  yield* term().opacity(0, 0.5);
  yield* waitFor(0.3);

  // ========== SCENE 5: CTA (10s) ==========
  const logo5 = createRef<Img>();
  const ctaTitle = createRef<Txt>();
  const cmdBox = createRef<Rect>();
  const web = createRef<Txt>();
  const ctaTag = createRef<Txt>();

  view.add(
    <>
      <Img ref={logo5} src={logo} width={140} y={-380} opacity={0} />
      <Txt ref={ctaTitle} fontSize={72} fill={'#ffffff'} fontWeight={700} y={-220} opacity={0} text="Install now:" />
      <Rect ref={cmdBox} width={1300} height={160} fill={'#1a1a1a'} radius={12} y={0} opacity={0} shadowBlur={30} shadowOffsetY={10}>
        <Txt fontSize={52} fill={'#0ea5a4'} fontFamily={'monospace'} fontWeight={700} text="npm install -g cortex-tms" />
      </Rect>
      <Txt ref={web} fontSize={64} fill={'#f97316'} fontWeight={600} y={220} opacity={0} text="cortex-tms.org" />
      <Txt ref={ctaTag} fontSize={38} fill={'#aaaaaa'} y={310} opacity={0} text="Tiered Memory for AI Agents" />
    </>
  );

  yield* logo5().opacity(1, 0.5);
  yield* waitFor(0.3);
  yield* ctaTitle().opacity(1, 0.5);
  yield* waitFor(0.4);
  cmdBox().scale(0.95);
  yield* all(cmdBox().opacity(1, 0.5), cmdBox().scale(1, 0.5));
  yield* waitFor(0.5);
  yield* all(cmdBox().scale(1.05, 0.3), cmdBox().shadowBlur(40, 0.3));
  yield* all(cmdBox().scale(1, 0.3), cmdBox().shadowBlur(30, 0.3));
  yield* waitFor(0.5);
  yield* web().opacity(1, 0.5);
  yield* waitFor(0.3);
  yield* ctaTag().opacity(1, 0.5);
  yield* waitFor(2.5);
  yield* all(logo5().opacity(0, 0.5), ctaTitle().opacity(0, 0.5), cmdBox().opacity(0, 0.5), web().opacity(0, 0.5), ctaTag().opacity(0, 0.5));
});
