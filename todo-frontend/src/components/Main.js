// Main.js

import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";

/**
 * Main component for handling tasks: displaying, adding, editing, and removing.
 */
function Main({ isAuthenticated }) {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [showTaskModal, setShowTaskModal] = useState(false); // State to control the visibility of the task modal
  const [currentTask, setCurrentTask] = useState(null); // State to store the current task being added or edited
  const [isViewing, setIsViewing] = useState(false); // New state to determine if the modal is for viewing

  // Fetch tasks from the backend when the component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks(); // Call fetchTasks when the user logs in
    } else {
      setTasks([]); // Optionally clear tasks on logout
    }
  }, [isAuthenticated]); // Re-fetch tasks when isAuthenticated changes

  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5008/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(response.data); // Updates the tasks state with fetched tasks
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // Function to handle showing the modal for adding a new task
  const handleShowAddTask = () => {
    setCurrentTask({ header: "", description: "" }); // Reset for a new task
    setIsViewing(false); // Ensure modal is not in read-only mode
    setShowTaskModal(true);
  };

  // Function to close the task modal
  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setIsViewing(false); // Reset viewing state upon modal close
  };

  // Handles saving a new or edited task
  const handleSaveTask = async () => {
    console.log("handleSaveTask is being called");
    // Determine the correct endpoint and method based on whether its adding or editing a task
    const endpoint = currentTask._id
      ? `http://localhost:5008/tasks/${currentTask._id}`
      : "http://localhost:5008/tasks";
    const method = currentTask._id ? "put" : "post";

    // Log the JWT Token and headers for the request
    console.log("JWT Token:", localStorage.getItem("token")); // Log the JWT token from localStorage
    console.log("Request headers:", {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    }); // Log the headers object to be sent with the request

    // Log the request data
    console.log("Request data:", {
      header: currentTask.header,
      description: currentTask.description,
    }); // Log the task data being sent

    // Log the endpoint and method for debugging
    console.log("Request endpoint:", endpoint);
    console.log("Request method:", method);

    try {
      console.log("Making request to:", endpoint, "with method:", method); // Log before making the request
      const response = await axios({
        method: method,
        url: endpoint,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json", // Ensure the server knows we're sending JSON
        },
        data: {
          header: currentTask.header,
          description: currentTask.description,
        },
      });

      // Log the successful response from the server
      console.log("Successful response:", response);

      if (method === "post") {
        // Assuming the backend returns the created task object in the response
        setTasks((prevTasks) => [...prevTasks, response.data]);
      } else {
        // Assuming the backend returns the updated task object in the response
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === currentTask._id ? response.data : task
          )
        );
      }

      // Close the modal and reset viewing/editing state
      setShowTaskModal(false);
      setIsViewing(false);
      setCurrentTask(null); // Reset currentTask to clear the form
    } catch (error) {
      console.error("Failed to save task:", error);
      console.log(
        "Error response data:",
        error.response ? error.response.data : "No response data"
      );
      console.log(
        "Error status:",
        error.response ? error.response.status : "No response status"
      );
      alert("Failed to save task. Please try again.");
    }
  };

  // function to populate the modal with the selected task's data for editing
  const handleEditTask = (task) => {
    setCurrentTask(task); // Load task for editing
    setIsViewing(false); // Ensure modal is not in read-only mode
    setShowTaskModal(true);
  };

  // Function to delete/remove a task
  const handleRemoveTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5008/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the JWT token in the Authorization header
        },
      });
      // Filter out the removed task from the tasks state
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Failed to remove task:", error);
      alert("Failed to remove task. Please ensure you are logged in."); // Provide feedback to the user
    }
  };

  // Function to show task details in a read-only manner
  const handleShowTaskDetails = (task) => {
    setCurrentTask(task); // Load task for viewing
    setIsViewing(true); // Set to read-only mode
    setShowTaskModal(true);
  };

  // Render function
  return (
    <div>
      <h2>Tasks</h2>
      <Button
        variant="outline-success"
        onClick={() => {
          if (!isAuthenticated) {
            alert("Please register and login to add tasks.");
          } else {
            handleShowAddTask();
          }
        }}
        // Apply a visual cue for disabled state without using the `disabled` attribute
        style={{ opacity: isAuthenticated ? 1 : 0.5 }}
      >
        Add Task
      </Button>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Task Number</th>
            <th>Task Heading</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task._id}>
              <td>{index + 1}</td>
              <td>{task.header}</td>
              <td>
                <Button
                  variant="info"
                  className="mr-2"
                  onClick={() => handleShowTaskDetails(task)}
                >
                  Read
                </Button>
                <Button
                  variant="primary"
                  className="mr-2"
                  onClick={() => handleEditTask(task)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveTask(task._id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* This modal will appear when the user clicks the "Add Task" button or chooses to edit an existing task */}
      <Modal show={showTaskModal} onHide={handleCloseTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isViewing
              ? "Task Details"
              : currentTask?._id
              ? "Edit Task"
              : "Add Task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isViewing && (
            <Alert variant="info">
              This content is read-only. Please select the edit button to edit
              this task.
            </Alert>
          )}
          <Form>
            <Form.Group>
              <Form.Label>Task Details</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task header"
                readOnly={isViewing} // Control editability based on isViewing state
                value={currentTask?.header}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, header: e.target.value })
                }
              />

              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Task description"
                readOnly={isViewing} // Control editability based on isViewing state
                value={currentTask?.description}
                onChange={(e) =>
                  setCurrentTask({
                    ...currentTask,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isViewing ? (
            <Button variant="secondary" onClick={handleCloseTaskModal}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handleCloseTaskModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveTask}>
                Save Changes
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Main;
