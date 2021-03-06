import React, { ReactElement } from 'react';

import AboutSection from './AboutSection';
import styles from './App.module.css';
import ProjectsSection from './ProjectsSection';
import StickyCodeBlock from './StickyCodeBlock';
import TechTalkSection from './TechTalkSection';
import TimelineSection from './TimelineSection';
import WebTerminal from './WebTerminal';

const App = (): ReactElement => (
  <>
    <div className={styles.MainLayout}>
      <div className={styles.SideBar}>
        <StickyCodeBlock />
      </div>
      <div className={styles.ContentBlock}>
        <AboutSection />
        <ProjectsSection />
        <TechTalkSection />
        <TimelineSection />
      </div>
    </div>
    <WebTerminal />
  </>
);

export default App;
