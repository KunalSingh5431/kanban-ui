export const initialBoard = {
    columns: {
      "col-1": { id: "col-1", title: "To Do", cardIds: ["card-1", "card-2"] },
      "col-2": { id: "col-2", title: "In Progress", cardIds: ["card-3"] },
      "col-3": { id: "col-3", title: "Completed", cardIds: ["card-4"] },
    },
    columnOrder: ["col-1", "col-2", "col-3"],
  
    cards: {
      "card-1": {
        id: "card-1",
        title: "Design landing",
        description: "Create hero section",
        labels: ["Design"],
        priority: "High",
        dueDate: "2025-12-01",
        assignees: ["KS"],
        status: "todo",
      },
      "card-2": {
        id: "card-2",
        title: "Auth API",
        description: "Create login/signup endpoints",
        labels: ["Backend"],
        priority: "Medium",
        dueDate: null,
        assignees: ["AJ"],
        status: "todo",
      },
      "card-3": {
        id: "card-3",
        title: "Payment flow",
        description: "Integrate Stripe",
        labels: ["Payments"],
        priority: "High",
        dueDate: "2025-12-10",
        assignees: ["RZ"],
        status: "inprogress",
      },
      "card-4": {
        id: "card-4",
        title: "CI Setup",
        description: "Github Actions",
        labels: ["DevOps"],
        priority: "Low",
        dueDate: null,
        assignees: [],
        status: "done",
      },
    },
  };
  