import { fireEvent, screen, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthenticationContext } from "../../../contexts/authentication";
import { renderWithRouter } from "../../utils";
import MemeFeedPage from "../../../pages/MemeFeedPage/MemeFeedPage";
import * as fetchUtils from "../../../utils/fetchWithAuth";


beforeAll(() => {
  class IntersectionObserverMock {
    constructor(
      private callback: IntersectionObserverCallback,
      private options?: IntersectionObserverInit
    ) { }

    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn();
  }

  // @ts-ignore
  global.IntersectionObserver = IntersectionObserverMock;
});


beforeEach(() => {
  vi.spyOn(fetchUtils, "fetchWithAuth").mockImplementation(async (input) => {
    const url = typeof input === "string" ? input : input.url;

    const users = [
      {
        id: "dummy_user_id_1",
        username: "dummy_user_1",
        pictureUrl: "https://dummy.url/1",
      },
      {
        id: "dummy_user_id_2",
        username: "dummy_user_2",
        pictureUrl: "https://dummy.url/2",
      },
      {
        id: "dummy_user_id_3",
        username: "dummy_user_3",
        pictureUrl: "https://dummy.url/3",
      },
    ];


    const memes = [
      {
        id: "dummy_meme_id_1",
        authorId: "dummy_user_1",
        pictureUrl: "https://dummy.url/meme/1",
        description: "dummy meme 1",
        commentsCount: 3,
        texts: [
          { content: "dummy text 1", x: 0, y: 0 },
          { content: "dummy text 2", x: 100, y: 100 },
        ],
        createdAt: "2021-09-01T12:00:00Z",
      },
    ]

    if (url.includes("/memes")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          total: memes.length,
          pageSize: memes.length,
          results: memes,
        }),
      } as Response;
    }


    if (url.includes("/users/:id")) {
      return {
        ok: true,
        status: 200,
        json: async () => {
          return { id: "dummy_user_1", username: "dummy_user_1", pictureUrl: "https://dummy.url/1" }
        },
      } as Response;
    }

    if (url.includes("/users?ids=")) {
      //const ids = new URL(url).searchParams.get("ids")?.split(",") || [];
      return {
        ok: true,
        status: 200,
        json: async () => [
          {
            id: "dummy_user_1", username: "dummy_user_1", pictureUrl: "https://dummy.url/1",
          },
          {
            id: "dummy_user_2", username: "dummy_user_2", pictureUrl: "https://dummy.url/2",
          },
          {
            id: "dummy_user_3", username: "dummy_user_3", pictureUrl: "https://dummy.url/3",
          },
        ],
      } as Response;

    }

    if (url.includes("/comments")) {
      return {
        ok: true,
        status: 200,
        json: async () => [
          { id: "dummy_comment_id_1", content: "dummy comment 1", authorId: "dummy_user_1" },
          { id: "dummy_comment_id_2", content: "dummy comment 2", authorId: "dummy_user_2" },
          { id: "dummy_comment_id_3", content: "dummy comment 3", authorId: "dummy_user_3" },
        ],
      } as Response;
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({}),
    } as Response;
  });
});



describe("routes/_authentication/index", () => {
  describe("MemeFeedPage", () => {
    function renderMemeFeedPage() {
      return renderWithRouter({
        component: MemeFeedPage,
        Wrapper: ({ children }) => (
          <ChakraProvider>
            <QueryClientProvider client={new QueryClient()}>
              <AuthenticationContext.Provider
                value={{
                  state: {
                    isAuthenticated: true,
                    userId: "dummy_user_id",
                    token: "dummy_token",
                  },
                  authenticate: () => { },
                  signout: () => { },
                }}
              >
                {children}
              </AuthenticationContext.Provider>
            </QueryClientProvider>
          </ChakraProvider>
        ),
      });
    }

    it("should fetch the memes and display them with their comments", async () => {
      renderMemeFeedPage();

      await waitFor(() => {
        // We check that the right author's username is displayed
        expect(screen.getByTestId("meme-author-dummy_meme_id_1")).toHaveTextContent('dummy_user_1');

        // We check that the right meme's picture is displayed
        expect(screen.getByTestId("meme-picture-dummy_meme_id_1")).toHaveStyle({
          'background-image': 'url("https://dummy.url/meme/1")',
        });

        // We check that the right texts are displayed at the right positions
        const text1 = screen.getByTestId("meme-picture-dummy_meme_id_1-text-0");
        const text2 = screen.getByTestId("meme-picture-dummy_meme_id_1-text-1");
        expect(text1).toHaveTextContent('dummy text 1');
        expect(text1).toHaveStyle({
          'top': '0px',
          'left': '0px',
        });
        expect(text2).toHaveTextContent('dummy text 2');
        expect(text2).toHaveStyle({
          'top': '100px',
          'left': '100px',
        });

        // We check that the right description is displayed
        expect(screen.getByTestId("meme-description-dummy_meme_id_1")).toHaveTextContent('dummy meme 1');

        // We check that the right number of comments is displayed
        expect(screen.getByTestId("meme-comments-count-dummy_meme_id_1")).toHaveTextContent('3 comments');
        
        // Click to open the comments section
        fireEvent.click(screen.getByTestId("meme-comments-section-dummy_meme_id_1"));


        // We check that the right comments with the right authors are displayed
        expect(screen.getByTestId("meme-comment-content-dummy_meme_id_1-dummy_comment_id_1")).toHaveTextContent('dummy comment 1');
        expect(screen.getByTestId("meme-comment-author-dummy_meme_id_1-dummy_comment_id_1")).toHaveTextContent('dummy_user_1');

        expect(screen.getByTestId("meme-comment-content-dummy_meme_id_1-dummy_comment_id_2")).toHaveTextContent('dummy comment 2');
        expect(screen.getByTestId("meme-comment-author-dummy_meme_id_1-dummy_comment_id_2")).toHaveTextContent('dummy_user_2');

        expect(screen.getByTestId("meme-comment-content-dummy_meme_id_1-dummy_comment_id_3")).toHaveTextContent('dummy comment 3');
        expect(screen.getByTestId("meme-comment-author-dummy_meme_id_1-dummy_comment_id_3")).toHaveTextContent('dummy_user_3');
      });
    });
  });
});
