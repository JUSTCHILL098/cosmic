// AniList GraphQL API + OAuth helpers

const GQL = "https://graphql.anilist.co";

export const ANILIST_AUTH_URL = `https://anilist.co/api/v2/oauth/authorize?client_id=${import.meta.env.VITE_ANILIST_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_ANILIST_REDIRECT_URI)}&response_type=code`;

// Exchange auth code for access token (needs a backend — we use Supabase Edge Function or direct)
// Since we can't expose client_secret in frontend, we store the token after the user pastes it
// OR use implicit flow (token directly in URL hash)
export const ANILIST_IMPLICIT_URL = `https://anilist.co/api/v2/oauth/authorize?client_id=${import.meta.env.VITE_ANILIST_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_ANILIST_REDIRECT_URI)}&response_type=token`;

export const gql = async (query, variables = {}, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(GQL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
};

// ── Queries ──────────────────────────────────────────────────────────────────

export const GET_VIEWER = `
  query {
    Viewer {
      id name siteUrl
      avatar { large medium }
      bannerImage
      statistics {
        anime {
          count episodesWatched minutesWatched
          meanScore
          genres(limit:5,sort:COUNT_DESC) { genre count }
        }
        manga { count chaptersRead volumesRead }
      }
    }
  }
`;

export const GET_MEDIA_LIST = `
  query($userId:Int,$type:MediaType,$status:MediaListStatus,$page:Int,$perPage:Int){
    Page(page:$page,perPage:$perPage){
      pageInfo{hasNextPage}
      mediaList(userId:$userId,type:$type,status:$status,sort:UPDATED_TIME_DESC){
        id status score progress
        media{
          id title{romaji english native}
          coverImage{large medium}
          episodes chapters
          format status
          averageScore
        }
      }
    }
  }
`;

export const SAVE_MEDIA_LIST = `
  mutation($mediaId:Int,$status:MediaListStatus,$progress:Int,$score:Float){
    SaveMediaListEntry(mediaId:$mediaId,status:$status,progress:$progress,score:$score){
      id status progress score
    }
  }
`;

export const SEARCH_ANIME = `
  query($search:String,$page:Int,$perPage:Int){
    Page(page:$page,perPage:$perPage){
      media(search:$search,type:ANIME,sort:SEARCH_MATCH){
        id title{romaji english}
        coverImage{large}
        episodes format status averageScore
      }
    }
  }
`;

export const GET_ANIME_BY_ID = `
  query($id:Int){
    Media(id:$id,type:ANIME){
      id title{romaji english native}
      coverImage{large}
      episodes format status averageScore
      description(asHtml:false)
    }
  }
`;
