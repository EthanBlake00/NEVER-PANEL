import {algoliasearch} from "algoliasearch";

export const getAlgoliaClient = () => {
    return algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);
};