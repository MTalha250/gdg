import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { DashboardStats } from "@/types";

// Module-scoped cache so all dashboard widgets share a single fetch.
let cachedStats: DashboardStats | null = null;
let inFlight: Promise<DashboardStats> | null = null;
const subscribers = new Set<(stats: DashboardStats | null) => void>();

const fetchStats = async (token: string): Promise<DashboardStats> => {
  if (cachedStats) return cachedStats;
  if (inFlight) return inFlight;

  inFlight = axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      cachedStats = res.data as DashboardStats;
      subscribers.forEach((cb) => cb(cachedStats));
      return cachedStats!;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
};

// Force the next call to refetch from the server (e.g. after a mutation).
export const invalidateDashboardStats = () => {
  cachedStats = null;
};

export const useDashboardStats = () => {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(cachedStats);
  const [loading, setLoading] = useState(!cachedStats);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;
    const subscriber = (next: DashboardStats | null) => {
      if (active) setStats(next);
    };
    subscribers.add(subscriber);

    if (cachedStats) {
      setStats(cachedStats);
      setLoading(false);
    } else {
      setLoading(true);
      fetchStats(token)
        .then((data) => {
          if (active) {
            setStats(data);
            setError(null);
          }
        })
        .catch((err) => {
          if (active) setError(err);
          console.error("Error fetching dashboard stats:", err);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => {
      active = false;
      subscribers.delete(subscriber);
    };
  }, [token]);

  return { stats, loading, error };
};
