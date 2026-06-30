import { baseApi } from "@/store/api/baseApi";

export interface QuoteTemplate {
  id: string;
  userId: string;
  footerText: string;
  quoteValidity: string;
  hstWording: string;
  paymentTerms: string;
  holdbackTerms: string;
  defaultAssumptions: string;
  defaultExclusions: string;
  defaultNotes: string;
  createdAt: string;
  updatedAt: string;
}

interface GetTemplateResponse {
  success: boolean;
  message: string;
  data: QuoteTemplate;
}

export const getTemplateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTemplate: builder.query<
      GetTemplateResponse,
      void
    >({
      query: () => ({
        url: "/user/quote-template",
        method: "GET",
      }),
      providesTags: ["QuoteTemplate"],
    }),
  }),
});

export const {
  useGetTemplateQuery,
} = getTemplateApi;