// src/lib/github.ts

export interface BranchStats {
  mainBranch: number;
  allBranches: number;
}

export interface CommitBreakdown {
  personal: BranchStats;
  org: BranchStats;
  totals: BranchStats;
}

interface GraphQLResponse {
  data?: {
    viewer: {
      id: string;
      login: string;
      repositories: {
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
        nodes: Array<{
          name: string;
          owner: {
            login: string;
            __typename: "Organization" | "User";
          };
          defaultBranchRef: {
            target: {
              history?: {
                totalCount: number;
              };
            };
          } | null;
          refs: {
            pageInfo: {
              hasNextPage: boolean;
              endCursor: string | null;
            };
            nodes: Array<{
              name: string;
              target: {
                history?: {
                  totalCount: number;
                };
              };
            }>;
          } | null;
        }>;
      };
    };
  };
  errors?: unknown[];
}

const ALL_BRANCH_COMMITS_QUERY = `
  query GetBranchCommits($since: GitTimestamp!, $cursor: String) {
    viewer {
      id
      login
      repositories(
        first: 50
        after: $cursor
        affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]
        ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          owner {
            login
            __typename
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(since: $since) {
                  totalCount
                }
              }
            }
          }
          refs(first: 50, refPrefix: "refs/heads/") {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              name
              target {
                ... on Commit {
                  history(since: $since) {
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getMonthlyCommitBreakdown(): Promise<CommitBreakdown> {
  const token = 
  process.env.GITHUB_TOKEN || 
  (typeof import.meta !== "undefined" && (import.meta as Record<string, any>).env?.GITHUB_TOKEN);

  const emptyBreakdown: CommitBreakdown = {
    personal: { mainBranch: 0, allBranches: 0 },
    org: { mainBranch: 0, allBranches: 0 },
    totals: { mainBranch: 0, allBranches: 0 },
  };

  if (!token) {
    console.warn("GitHub token missing.");
    return emptyBreakdown;
  }

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  let personalMain = 0;
  let personalAll = 0;
  let orgMain = 0;
  let orgAll = 0;

  let hasNextPage = true;
  let cursor: string | null = null;

  try {
    while (hasNextPage) {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: ALL_BRANCH_COMMITS_QUERY,
          variables: {
            since: firstDayOfMonth,
            cursor,
          },
        }),
      });

      const responseData: GraphQLResponse = await res.json();

      if (responseData.errors || !responseData.data) {
        console.error("GraphQL errors:", responseData.errors);
        break;
      }

      const { viewer } = responseData.data;
      const currentUsername = viewer.login.toLowerCase();
      const repos = viewer.repositories;

      for (const repo of repos.nodes) {
        const isPersonalRepo = repo.owner.login.toLowerCase() === currentUsername;

        // 1. Calculate main/default branch count
        const mainCount = repo.defaultBranchRef?.target?.history?.totalCount ?? 0;

        // 2. Calculate sum of all branches
        let repoAllBranchesCount = 0;
        if (repo.refs?.nodes) {
          for (const branch of repo.refs.nodes) {
            repoAllBranchesCount += branch.target?.history?.totalCount ?? 0;
          }
        }

        // 3. Assign counts to Personal or Org buckets
        if (isPersonalRepo) {
          personalMain += mainCount;
          personalAll += repoAllBranchesCount;
        } else {
          orgMain += mainCount;
          orgAll += repoAllBranchesCount;
        }
      }

      hasNextPage = repos.pageInfo.hasNextPage;
      cursor = repos.pageInfo.endCursor;
    }

    return {
      personal: {
        mainBranch: personalMain,
        allBranches: personalAll,
      },
      org: {
        mainBranch: orgMain,
        allBranches: orgAll,
      },
      totals: {
        mainBranch: personalMain + orgMain,
        allBranches: personalAll + orgAll,
      },
    };
  } catch (error) {
    console.error("Failed to fetch commit breakdown:", error);
    return emptyBreakdown;
  }
}