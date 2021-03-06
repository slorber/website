import React, { ReactElement, ReactNode } from 'react';

import clsx from 'clsx';

import styles from './ConsoleSection.module.css';

type Props = {
  readonly id: string;
  readonly title: string;
  readonly className?: string;
  readonly titleClassName?: string;
  readonly children: ReactNode;
};

const ConsoleSection = ({
  id,
  title,
  className,
  titleClassName,
  children,
}: Props): ReactElement => (
  <section id={id} className={className}>
    <h3 className={clsx(styles.Title, titleClassName)}>
      <code>
        $&nbsp;
        {title}
      </code>
    </h3>
    {children}
  </section>
);

export default ConsoleSection;
