import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query {
    tasks {
      id
      title
      status
      dueDate
      parentId

      subtasks {
        id
        title
        status
        dueDate
      }
    }
  }
`;