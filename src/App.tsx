import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent, JSX } from 'react';
import './App.css';

const API_URL = 'https://script.google.com/macros/s/AKfycbxRTLnxVHwxf4FuE851ALXQeSxbKXZ26ufBmy1byRNqb_4yKkJZsc7RynKKslKjft2M/exec';

interface Job {
  serial: number;
  customer: string;
  plate: string;
  phone: string;
  status: string;
}

function App(): JSX.Element {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customer, setCustomer] = useState<string>('');
  const [plate, setPlate] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    void fetchJobs();
  }, []);

  const fetchJobs = async (): Promise<void> => {
    try {
      const response: Response = await fetch(API_URL);
      const data: unknown = await response.json();

      if (Array.isArray(data)) {
        const parsedJobs: Job[] = data.map((item) => ({
          serial: Number(item.serial),
          customer: String(item.customer),
          plate: String(item.plate),
          phone: String(item.phone),
          status: String(item.status),
        }));
        setJobs(parsedJobs);
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleAddJob = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const job = {
      customer,
      plate,
      phone,
      status,
    };

    try {
      const response: Response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(job),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: string = await response.text();
      console.log(result);

      setCustomer('');
      setPlate('');
      setPhone('');
      setStatus('');
      void fetchJobs();
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <div className="App">
      <h1>PITSTOP Workshop Panel</h1>

      <form onSubmit={handleAddJob} className="job-form">
        <input
          type="text"
          placeholder="Customer Name"
          value={customer}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomer(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Plate Number"
          value={plate}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPlate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Status"
          value={status}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setStatus(e.target.value)}
          required
        />
        <button type="submit">Add Job</button>
      </form>

      <table className="job-table">
        <thead>
          <tr>
            <th>SL No.</th>
            <th>Customer</th>
            <th>Plate Number</th>
            <th>Phone No.</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.serial}>
              <td>{job.serial}</td>
              <td>{job.customer}</td>
              <td>{job.plate}</td>
              <td>{job.phone}</td>
              <td>{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
