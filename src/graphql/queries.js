import { gql } from "@apollo/client";

export const GET_ANALYTICS = gql`
  query {
    productivityAnalytics {
      productivityScore
      onTimeRate
      averageCompletionTimeHours
      delayPercentage
    }
  }
`;