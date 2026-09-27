import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

beforeAll(() => {
  global.fetch = () => Promise.reject(new Error('no backend in test'));
});

function clickNav(label) {
  const nav = document.querySelector('.nav-tabs');
  const btn = Array.from(nav.querySelectorAll('button')).find(b => b.textContent.includes(label));
  if (!btn) throw new Error('Nav button not found: ' + label);
  fireEvent.click(btn);
}

function mockLogin(role, email) {
  global.fetch = (url, opts) => {
    if (String(url).includes('/api/auth/login')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true, user: { name: 'Test User', role, email } }) });
    }
    return Promise.reject(new Error('no backend in test'));
  };
}

async function loginAs(role, email, navLabel) {
  mockLogin(role, email);
  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), { target: { value: email } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/ }));
  await waitFor(() => {
    const nav = document.querySelector('.nav-tabs');
    expect(nav).not.toBeNull();
    expect(Array.from(nav.querySelectorAll('button')).some(b => b.textContent.includes(navLabel))).toBe(true);
  });
}

const PUBLIC_CASES = [
  ['Overview', '/'],
  ['Hive Monitor', '/monitor'],
  ['AI Insights', '/ai'],
  ['Blockchain Trace', '/chain'],
  ['Consumer Scan', '/scan'],
  ['Scale-Up Plan', '/scale-up'],
];

const ROLE_CASES = {
  ADMIN: [['Dashboard', '/'], ['Users', '/admin/users'], ['All Hives', '/monitor'], ['All Batches', '/chain'], ['AI & Alerts', '/ai'], ['Scan Analytics', '/scan'], ['Scale-Up', '/scale-up'], ['Settings', '/admin/settings'], ['Reports', '/admin/reports']],
  BEEKEEPER: [['My Hives', '/monitor'], ['AI Insights', '/ai'], ['Harvest', '/beekeeper/harvest'], ['My Batches', '/beekeeper/batches'], ['Alerts', '/beekeeper/alerts'], ['Earnings', '/beekeeper/earnings'], ['Profile', '/beekeeper/profile']],
  QUALITY_OFFICER: [['Overview', '/'], ['Pending Queue', '/quality'], ['Lab Test', '/quality/test'], ['History', '/quality/history'], ['Rejected', '/quality/rejected'], ['Standards', '/quality/standards'], ['Reports', '/quality/reports'], ['Hives', '/hives'], ['Blockchain', '/chain']],
  PROCESSOR: [['Overview', '/'], ['Incoming', '/processing/incoming'], ['Processing', '/processing/log'], ['Packaging', '/processing/packaging'], ['Inventory', '/processing/inventory'], ['Dispatch', '/processing/dispatch'], ['Facility', '/processing/facility'], ['Blockchain', '/chain']],
};

afterEach(() => {
  window.history.replaceState({}, '', '/');
});

test('public navbar buttons update the URL', async () => {
  render(<App />);
  for (const [label, path] of PUBLIC_CASES) {
    clickNav(label);
    await waitFor(() => expect(window.location.pathname).toBe(path));
  }
});

test('browser back/forward navigation works', async () => {
  render(<App />);
  clickNav('Hive Monitor');
  await waitFor(() => expect(window.location.pathname).toBe('/monitor'));
  clickNav('AI Insights');
  await waitFor(() => expect(window.location.pathname).toBe('/ai'));

  window.history.back();
  await waitFor(() => expect(window.location.pathname).toBe('/monitor'));

  window.history.forward();
  await waitFor(() => expect(window.location.pathname).toBe('/ai'));
});

test('login button goes to /login', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));
  await waitFor(() => expect(window.location.pathname).toBe('/login'));
});

for (const [role, cases] of Object.entries(ROLE_CASES)) {
  test(`${role} navbar buttons update the URL`, async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    await waitFor(() => expect(window.location.pathname).toBe('/login'));
    await loginAs(role, role.toLowerCase() + '@honeychain.demo', cases[0][0]);
    for (const [label, path] of cases) {
      clickNav(label);
      await waitFor(() => expect(window.location.pathname).toBe(path));
    }
  });
}