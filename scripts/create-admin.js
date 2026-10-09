#!/usr/bin/env node

/**
 * Secure Initial Administrator Provisioning Script
 *
 * Usage:
 *   node scripts/create-admin.js --name "Sarat Kumar Singh" --email "admin@willynilly.in" --password "StrongPassword123!"
 * Or run directly without flags for interactive prompts or default values:
 *   npm run create-admin
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

// 1. Automatically load .env.local and .env if present
function loadEnvFile(filename) {
  try {
    const envPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch (err) {
    // ignore
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

import connectDB from '../src/backend/config/db.js';
import Admin from '../src/models/Admin.js';
import { hashPassword } from '../src/backend/security/passwords.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const val = args[i + 1];
      if (val && !val.startsWith('--')) {
        parsed[key] = val;
        i++;
      } else {
        parsed[key] = true;
      }
    }
  }
  return parsed;
}

function prompt(question) {
  if (!process.stdin.isTTY) {
    return Promise.resolve('');
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('========================================================');
  console.log(' Willy Nilly Agro Tourism — Admin Provisioning Tool    ');
  console.log('========================================================\n');

  const args = parseArgs();
  let name = args.name;
  let email = args.email;
  let password = args.password;

  if (!name && process.stdin.isTTY) {
    name = await prompt('Enter Administrator Name [default: Sarat Kumar Singh]: ');
  }
  if (!name) name = 'Sarat Kumar Singh';

  if (!email && process.stdin.isTTY) {
    email = await prompt('Enter Administrator Email [default: admin@willynilly.in]: ');
  }
  if (!email) email = 'admin@willynilly.in';

  if (!password && process.stdin.isTTY) {
    password = await prompt('Enter Admin Password (min 8 characters): ');
  }

  if (!password) {
    console.error('Error: Password is required. Supply via --password "YourPassword" or CLI prompt.');
    console.log('\nExample:');
    console.log('  node scripts/create-admin.js --name "Sarat Kumar Singh" --email "admin@willynilly.in" --password "Admin@12345"\n');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  try {
    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: normalizedEmail });

    const passwordHash = await hashPassword(password);

    if (existing) {
      existing.name = name.trim();
      existing.passwordHash = passwordHash;
      existing.isActive = true;
      existing.role = 'superadmin';
      existing.tokenVersion += 1; // Invalidate any older sessions
      await existing.save();

      console.log(`\nAdministrator "${existing.name}" (${existing.email}) updated successfully.`);
      console.log(`Role: ${existing.role}`);
      console.log(`Status: Active`);
      console.log(`Admin ID: ${existing._id}`);
      console.log('\nYou can now log in at: http://localhost:3000/admin/login');
      process.exit(0);
    }

    const admin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'superadmin',
      isActive: true,
      tokenVersion: 1,
    });

    console.log(`\nSuccess! Administrator "${admin.name}" (${admin.email}) created successfully.`);
    console.log(`Role: ${admin.role}`);
    console.log(`Status: Active`);
    console.log(`Admin ID: ${admin._id}`);
    console.log('\nYou can now log in at: http://localhost:3000/admin/login\n');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create/update administrator:', err.message);
    process.exit(1);
  }
}

main();
