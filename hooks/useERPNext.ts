import { useState, useEffect } from 'react';
import { erpNextService } from '@/services/erpnext';

interface UseERPNextOptions {
  autoFetch?: boolean;
  filters?: Record<string, any>;
}

export function usePatients(options: UseERPNextOptions = {}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await erpNextService.getPatients(options.filters);
      setPatients(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patientData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await erpNextService.createPatient(patientData);
      await fetchPatients(); // Refresh list
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create patient');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchPatients();
    }
  }, []);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    refetch: fetchPatients
  };
}

export function useAppointments(options: UseERPNextOptions = {}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await erpNextService.getAppointments(options.filters);
      setAppointments(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await erpNextService.createAppointment(appointmentData);
      await fetchAppointments(); // Refresh list
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchAppointments();
    }
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    refetch: fetchAppointments
  };
}

export function useInventory(options: UseERPNextOptions = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await erpNextService.getItems(options.filters);
      setItems(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const createStockEntry = async (stockData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await erpNextService.createStockEntry(stockData);
      await fetchItems(); // Refresh list
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create stock entry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchItems();
    }
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    createStockEntry,
    refetch: fetchItems
  };
}

export function useBilling(options: UseERPNextOptions = {}) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await erpNextService.getSalesInvoices(options.filters);
      setInvoices(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await erpNextService.createSalesInvoice(invoiceData);
      await fetchInvoices(); // Refresh list
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchInvoices();
    }
  }, []);

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    refetch: fetchInvoices
  };
}

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpNextService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboardData
  };
}