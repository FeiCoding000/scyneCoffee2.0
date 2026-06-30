import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addCustomer,
  getAllCustomersFromFirestore,
} from "../../services/customerService";
import type { CreateCustomerDto } from "../../schemas/dto/createCustomerDto";
import type { CustomerEntity } from "../../schemas/entity/customerEntity";
import type { ApiError } from "../../types/api";

type CustomerState = {
  customers: CustomerEntity[];
  loading: boolean;
  error: ApiError | null;
};

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

export const getCustomers = createAsyncThunk<
  CustomerEntity[],
  void,
  { rejectValue: ApiError }
>("customers/getCustomers", async (_, { rejectWithValue }) => {
  const result = await getAllCustomersFromFirestore();

  if (!result.ok) {
    return rejectWithValue(result.error);
  }

  return result.data;
});

export const createCustomer = createAsyncThunk<
  CustomerEntity,
  CreateCustomerDto,
  { rejectValue: ApiError }
>("customers/createCustomer", async (customer, { rejectWithValue }) => {
  const result = await addCustomer(customer);

  if (!result.ok) {
    return rejectWithValue(result.error);
  }

  return result.data;
});

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? {
          code: "unknown-error",
          message: action.error.message ?? "Failed to fetch customers.",
        };
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? {
          code: "unknown-error",
          message: action.error.message ?? "Failed to add customer.",
        };
      });
  },
});

export const { clearCustomerError } = customerSlice.actions;
export default customerSlice.reducer;
