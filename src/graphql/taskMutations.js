import { gql } from "@apollo/client";

export const COMPLETE_TASK = gql`
  mutation CompleteTask($taskId: Int!) {
    completeTask(taskId: $taskId) {
      id
      status
      completedAt
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $dueDate: DateTime) {
    createTask(title: $title, dueDate: $dueDate) {
      id
      title
      status
      dueDate
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: Int!) {
    deleteTask(taskId: $taskId)
  }
`;


