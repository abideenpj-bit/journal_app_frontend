import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/authApi.js";

/* =========================
   FETCH ALL MANUSCRIPTS
========================= */
export const fetchAllManuscripts = createAsyncThunk(
  "admin/fetchAllManuscripts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/admin/manuscripts");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch manuscripts"
      );
    }
  }
);

/* =========================
   TOGGLE PUBLISH STATUS
========================= */
export const togglePublishStatus = createAsyncThunk(
  "admin/togglePublishStatus",
  async (manuscriptId, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "/admin/manuscripts/publish-toggle",
        { manuscriptId }
      );

      return res.data.manuscript;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to toggle publish status"
      );
    }
  }
);

/* =========================
   FETCH EXPERTS
========================= */
export const fetchExperts = createAsyncThunk(
  "admin/fetchExperts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/admin/experts");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch experts"
      );
    }
  }
);

/* =========================
   ASSIGN REVIEWER
========================= */
export const assignReviewer = createAsyncThunk(
  "admin/assignReviewer",
  async ({ manuscriptId, reviewerId }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "/admin/manuscripts/assign-reviewer",
        {
          manuscriptId,
          reviewerId,
        }
      );

      return res.data.manuscript;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to assign reviewer"
      );
    }
  }
);

/* =========================
   DOWNLOAD MANUSCRIPT
========================= */
export const downloadManuscript = createAsyncThunk(
  "admin/downloadManuscript",
  async (manuscriptId, { rejectWithValue }) => {
    try {
      const res = await API.get(
        `/admin/manuscripts/${manuscriptId}/download`,
        {
          responseType: "blob",
        }
      );

      // filename
      const disposition = res.headers["content-disposition"];

      let filename = "manuscript";

      if (disposition?.includes("filename=")) {
        filename = disposition
          .split("filename=")[1]
          .replace(/"/g, "");
      }

      // create download
      const blob = new Blob([res.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      return filename;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to download manuscript"
      );
    }
  }
);

/* =========================
   HELPERS
========================= */

const updateManuscript = (state, updatedManuscript) => {
  const index = state.manuscripts.findIndex(
    (m) => m._id === updatedManuscript._id
  );

  if (index !== -1) {
    state.manuscripts[index] = updatedManuscript;
  }
};

/* =========================
   SLICE
========================= */

const adminManuscriptsSlice = createSlice({
  name: "adminManuscripts",

  initialState: {
    manuscripts: [],
    experts: [],

    loading: false,
    actionLoading: false,
    downloadLoading: false,

    error: null,
    success: null,
  },

  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },

    clearAdminSuccess: (state) => {
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================
         FETCH MANUSCRIPTS
      ========================= */
      .addCase(fetchAllManuscripts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllManuscripts.fulfilled, (state, action) => {
        state.loading = false;
        state.manuscripts = action.payload;
      })

      .addCase(fetchAllManuscripts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =========================
         TOGGLE PUBLISH
      ========================= */
      .addCase(togglePublishStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(togglePublishStatus.fulfilled, (state, action) => {
        state.actionLoading = false;

        updateManuscript(state, action.payload);

        state.success = "Publish status updated";
      })

      .addCase(togglePublishStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /* =========================
         ASSIGN REVIEWER
      ========================= */
      .addCase(assignReviewer.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(assignReviewer.fulfilled, (state, action) => {
        state.actionLoading = false;

        updateManuscript(state, action.payload);

        state.success = "Reviewer assigned successfully";
      })

      .addCase(assignReviewer.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /* =========================
         FETCH EXPERTS
      ========================= */
      .addCase(fetchExperts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchExperts.fulfilled, (state, action) => {
        state.loading = false;
        state.experts = action.payload;
      })

      .addCase(fetchExperts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* =========================
         DOWNLOAD
      ========================= */
      .addCase(downloadManuscript.pending, (state) => {
        state.downloadLoading = true;
        state.error = null;
      })

      .addCase(downloadManuscript.fulfilled, (state) => {
        state.downloadLoading = false;
        state.success = "Download started";
      })

      .addCase(downloadManuscript.rejected, (state, action) => {
        state.downloadLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAdminError,
  clearAdminSuccess,
} = adminManuscriptsSlice.actions;

export default adminManuscriptsSlice.reducer;