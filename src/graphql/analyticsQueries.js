import { gql } from "@apollo/client";

export const GET_ANALYTICS = gql`
  query {
    productivityAnalytics {
      totalTasks
      completedTasks
      pendingTasks
      averageCompletionTimeHours
      productivityScore
      delayPercentage
      onTimeRate
    }
  }
`;