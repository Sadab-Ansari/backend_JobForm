"use client"

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface Job {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  state: string;
  district: string;
  address: string;
  skills: string;
}

type JobsState = Job[];

interface ActionProps {
  ADD_JOB: Omit<Job, 'id'>;
  SET_JOBS: Job[];
  UPDATE_JOB: Job;
  DELETE_JOB: number;
}

type Action =
  | { type: 'ADD_JOB'; payload: ActionProps['ADD_JOB'] }
  | { type: 'SET_JOBS'; payload: ActionProps['SET_JOBS'] }
  | { type: 'UPDATE_JOB'; payload: ActionProps['UPDATE_JOB'] }
  | { type: 'DELETE_JOB'; payload: ActionProps['DELETE_JOB'] };

const initialJobs: Job[] = []; // Mock DB - empty initially

function jobsReducer(state: JobsState, action: Action): JobsState {
  switch (action.type) {
    case 'ADD_JOB':
      const newId = Math.max(0, ...state.map(j => j.id)) + 1;
      return [...state, { ...action.payload, id: newId }];
    case 'SET_JOBS':
      return action.payload;
    case 'UPDATE_JOB':
      return state.map(job => job.id === action.payload.id ? action.payload : job);
    case 'DELETE_JOB':
      return state.filter(job => job.id !== action.payload);
    default:
      return state;
  }
}

interface JobContextType {
  jobs: Job[];
  addJob: (jobData: Omit<Job, 'id'>) => void;
  fetchJobs: () => Job[]; // Manual "query"
  updateJob: (job: Job) => void;
  deleteJob: (id: number) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, dispatch] = useReducer(jobsReducer, initialJobs);

  const addJob = (jobData: Omit<Job, 'id'>) => {
    dispatch({ type: 'ADD_JOB', payload: jobData });
  };

  const fetchJobs = (): Job[] => {
    return jobs; // Manual DB read - instant
  };

  const updateJob = (job: Job) => {
    dispatch({ type: 'UPDATE_JOB', payload: job });
  };

  const deleteJob = (id: number) => {
    dispatch({ type: 'DELETE_JOB', payload: id });
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, fetchJobs, updateJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}

