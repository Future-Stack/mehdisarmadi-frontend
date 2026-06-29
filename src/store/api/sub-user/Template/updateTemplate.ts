import { baseApi } from "@/store/api/baseApi";
import { QuoteTemplate } from "./getTemplate";

export interface UpdateTemplatePayload {
  footerText: string;
  quoteValidity: string;
  hstWording: string;
  paymentTerms: string;
  holdbackTerms: string;
  defaultAssumptions: string;
  defaultExclusions: string;
  defaultNotes: string;
}

interface UpdateTemplateResponse {
  success: boolean;
  message: string;
  data: QuoteTemplate;
}

export const updateTemplateApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      updateTemplate: builder.mutation<
        UpdateTemplateResponse,
        UpdateTemplatePayload
      >({
        query: (body) => ({
          url: "/user/quote-template",
          method: "PATCH",
          body,
        }),
        invalidatesTags: ["QuoteTemplate"],
      }),
    }),
  });

export const {
  useUpdateTemplateMutation,
} = updateTemplateApi;