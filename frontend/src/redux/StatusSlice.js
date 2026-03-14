// redux/StatusSlice.js
import { createSlice } from "@reduxjs/toolkit";

const StatusSlice = createSlice({
  name: "status",
  initialState: {
    myStatuses: [], // Current user's statuses
    otherStatuses: [], // Other users' statuses
    viewedStatuses: [], // IDs of statuses current user has viewed
  },
  reducers: {
    setMyStatuses: (state, action) => {
      state.myStatuses = action.payload;
    },
    setOtherStatuses: (state, action) => {
      state.otherStatuses = action.payload;
    },
    addStatus: (state, action) => {
      state.myStatuses.unshift(action.payload);
    },
    deleteStatus: (state, action) => {
      state.myStatuses = state.myStatuses.filter(
        (s) => s._id !== action.payload,
      );
    },
    addViewedStatus: (state, action) => {
      if (!state.viewedStatuses.includes(action.payload)) {
        state.viewedStatuses.push(action.payload);
      }
    },
    // ✅ Real-time: Add new status from another user
    addNewStatusFromOther: (state, action) => {
      const newStatus = action.payload;
      const userId = newStatus.userId._id;

      // Find if user already has statuses
      const userIndex = state.otherStatuses.findIndex(
        (u) => u.userId._id === userId,
      );

      if (userIndex !== -1) {
        // ✅ Check if status already exists (prevent duplicates)
        const statusExists = state.otherStatuses[userIndex].statuses.some(
          (s) => s._id === newStatus._id,
        );

        if (!statusExists) {
          // Add to existing user's statuses
          state.otherStatuses[userIndex].statuses.unshift(newStatus);
        }
      } else {
        // Create new user entry
        state.otherStatuses.push({
          userId: newStatus.userId,
          statuses: [newStatus],
        });
      }
    },
    // ✅ Real-time: Update like status
    updateStatusLike: (state, action) => {
      const { statusId, likerData, isLiked } = action.payload;

      // Update in myStatuses
      const myStatus = state.myStatuses.find((s) => s._id === statusId);
      if (myStatus) {
        if (isLiked) {
          // Add like
          if (
            !myStatus.likes.some(
              (l) => (typeof l === "string" ? l : l._id) === likerData._id,
            )
          ) {
            myStatus.likes.push(likerData);
          }
        } else {
          // Remove like
          myStatus.likes = myStatus.likes.filter(
            (l) => (typeof l === "string" ? l : l._id) !== likerData._id,
          );
        }
      }

      // Update in otherStatuses
      state.otherStatuses = state.otherStatuses.map((userStatus) => ({
        ...userStatus,
        statuses: userStatus.statuses.map((s) => {
          if (s._id === statusId) {
            if (isLiked) {
              return {
                ...s,
                likes: s.likes.some(
                  (l) => (typeof l === "string" ? l : l._id) === likerData._id,
                )
                  ? s.likes
                  : [...s.likes, likerData],
              };
            } else {
              return {
                ...s,
                likes: s.likes.filter(
                  (l) => (typeof l === "string" ? l : l._id) !== likerData._id,
                ),
              };
            }
          }
          return s;
        }),
      }));
    },
    // ✅ Real-time: Update view count
    updateStatusView: (state, action) => {
      const { statusId, viewerData } = action.payload;

      const myStatus = state.myStatuses.find((s) => s._id === statusId);
      if (myStatus) {
        // Add to views array if not already there
        if (
          !myStatus.views.some(
            (v) => (typeof v === "string" ? v : v._id) === viewerData._id,
          )
        ) {
          myStatus.views.push(viewerData);
        }
      }
    },
    // ✅ Real-time: Remove deleted status
    removeStatus: (state, action) => {
      const { statusId, userId } = action.payload;

      // Remove from myStatuses
      state.myStatuses = state.myStatuses.filter((s) => s._id !== statusId);

      // Remove from otherStatuses
      state.otherStatuses = state.otherStatuses
        .map((userStatus) => ({
          ...userStatus,
          statuses: userStatus.statuses.filter((s) => s._id !== statusId),
        }))
        .filter((userStatus) => userStatus.statuses.length > 0); // Remove user entry if no statuses left
    },
  },
});

export const {
  setMyStatuses,
  setOtherStatuses,
  addStatus,
  deleteStatus,
  addViewedStatus,
  addNewStatusFromOther,
  updateStatusLike,
  updateStatusView,
  removeStatus,
} = StatusSlice.actions;

export default StatusSlice.reducer;
