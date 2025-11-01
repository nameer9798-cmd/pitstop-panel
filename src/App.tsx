import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './App.css';

const API_URL = "https://script.google.com/macros/s/AKfycbxRTLnxVHwxf4FuE851ALXQeSxbKXZ26ufBmy1byRNqb_4yKkJZsc7RynKKslKjft2M/exec";

type Job = {
  customer: string;
  plate: string;
  phone: string;
  status: string;
};

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<Job>({
    customer: '',
    plate: '',
    phone: '',
    status: 'Pending',
  });
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then((data: Job[]) => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(() => {
        setJobs([...jobs, form]);
        setForm({ customer: '', plate: '', phone: '', status: 'Pending' });
      });
  };

  const filteredJobs = jobs.filter(job =>
    job.customer.toLowerCase().includes(search.toLowerCase()) ||
    job.plate.toLowerCase().includes(search.toLowerCase()) ||
    job.phone.includes(search)
  );

  const handlePrint = () => window.print();

  return (
    <div className="App">
      <div style={{ textAlign: 'center' }}>
        <img
          src="/logo.png"
          alt="Pitstop Logo"
          style={{ maxHeight: '80px', marginBottom: '1rem' }}
        />
      </div>

      <h1>PITSTOP Workshop Panel</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="customer"
          placeholder="Customer Name"
          value={form.customer}
          onChange={handleChange}
          required
        />
        <input
          name="plate"
          placeholder="Plate Number"
          value={form.plate}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <button type="submit">Add Job</button>
      </form>

      <input
        type="text"
        placeholder="Search by customer, plate, or phone"
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      />

      <button onClick={handlePrint}>🖨️ Print Job Cards</button>

      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Plate</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job, index) => (
            <tr key={index} style={{ backgroundColor: getStatusColor(job.status) }}>
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

function getStatusColor(status: string): string {
  switch (status) {
    case 'Pending': return '#fff8e1';       // light yellow
    case 'In Progress': return '#e3f2fd';   // light blue
    case 'Completed': return '#e8f5e9';     // light green
    default: return 'white';
  }
}
