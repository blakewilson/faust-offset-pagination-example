import { gql, useQuery } from "@apollo/client";
import { getNextStaticProps } from "@faustwp/core";
import Link from "next/link";

/**
 * How many posts you want to display per page
 */
export const POSTS_PER_PAGE = 2;

/**
 * Calculates the "offset" by multiplying
 * the amount of pages by the posts per page
 *
 * @param {number} pageNumber
 * @returns
 */
function getOffsetFromPageNumber(pageNumber) {
  return pageNumber === 1 ? 0 : (pageNumber - 1) * POSTS_PER_PAGE;
}

export default function Page(props) {
  // Get our data from the cache
  const { data } = useQuery(Page.query, {
    variables: {
      postsPerPage: POSTS_PER_PAGE,
      offset: getOffsetFromPageNumber(props.pageNumber),
    },
  });

  const totalPosts = data.posts.pageInfo.offsetPagination.total;
  const numPages = Math.floor(totalPosts / POSTS_PER_PAGE);

  return (
    <>
      <p>Total Posts: {data.posts.pageInfo.offsetPagination.total}</p>

      <h2>Posts</h2>
      <ul>
        {data.posts.nodes.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      <h2>Pagination</h2>
      <ul>
        {[...Array(numPages)].map((x, i) => {
          const pageNum = i + 1;

          return (
            <li key={i}>
              <Link key={i} href={`/blog/page/${pageNum}`}>
                page {pageNum}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/**
 * Our page's Query
 */
Page.query = gql`
  query OffsetPaginatedQuery($postsPerPage: Int, $offset: Int) {
    posts(
      where: { offsetPagination: { size: $postsPerPage, offset: $offset } }
    ) {
      pageInfo {
        offsetPagination {
          hasMore
          hasPrevious
          total
        }
      }
      nodes {
        id
        title
      }
    }
  }
`;

/**
 * Our GraphQL variables for our above query. postsPerPage and the offset
 */
Page.variables = ({ params }) => {
  const { pageNumber = 1 } = params ?? {};

  return {
    postsPerPage: POSTS_PER_PAGE,
    offset: getOffsetFromPageNumber(pageNumber),
  };
};

export function getStaticProps(ctx) {
  /**
   * @link https://faustjs.org/docs/next/reference/getNextStaticProps
   */
  return getNextStaticProps(ctx, {
    Page,
    props: {
      pageNumber: ctx?.params?.pageNumber ?? 1,
    },
  });
}

export function getStaticPaths(ctx) {
  return {
    paths: [],
    fallback: "blocking",
  };
}
