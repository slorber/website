/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogListPaginator from '@theme/BlogListPaginator';

import styles from '../common.module.css';

export default ({ metadata, items }) => (
  <Layout title="Developer Sam Blog" description="Developer Sam Blog">
    <div className={styles.Container}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          {items.map(({ content: BlogPostContent, metadata: blogPostMetadata }) => (
            <div className={styles.BlogPostItem} key={blogPostMetadata.permalink}>
              <BlogPostItem
                frontMatter={BlogPostContent.frontMatter}
                metadata={blogPostMetadata}
                truncated
              >
                <BlogPostContent />
              </BlogPostItem>
            </div>
          ))}
          <BlogListPaginator metadata={metadata} />
        </div>
      </div>
    </div>
  </Layout>
);
