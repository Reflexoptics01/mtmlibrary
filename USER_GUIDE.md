# Maktaba — User Guide

## First setup

1. Your institute creates its own Supabase project and runs `supabase/schema.sql`.
2. The first staff member registers in the app and becomes admin.
3. Later staff register, then the admin opens **Staff** and sets their role to librarian.

## Library settings

The admin can open **Settings** to change the library name (shown in the header and footer), the borrowing
limit per student, the default loan period, the late fine per day, the lost-book fine, and the currency symbol.

## Books, students, borrowings

Use the navigation bar after login. Issuing and returning books updates copy counts in one database transaction.
Active loans can be **renewed** to extend the due date. Late fines are added on return. Pay fines from the
student detail page.

## Publications

Anyone can browse publications. Staff can upload PDF booklets and optional audio.

## Login problems

Ask an admin to reset the password in your institute’s Supabase Authentication dashboard, or use the email reset if you enabled it.
