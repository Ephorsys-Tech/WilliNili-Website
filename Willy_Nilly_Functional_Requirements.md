# Willy Nilly — Functional Requirements & Project Understanding

**Source document:** Business Website – Product Requirements Document (PRD), Version 1.0, October 2026  
**Business/brand stated in the PRD:** Willy Nilly (Horticulture & Agro Tourism)  
**Prepared for:** Mr. Sarat Kumar Singh  
**Purpose:** This document explains the business, complete MVP functionality, user journeys, administrator capabilities, business rules, scope boundaries, and pending client decisions. It is based on the supplied 25-page PRD.

> **Source-of-truth rule:** The PRD defines the agreed business scope. Anything marked “To Be Confirmed” remains undecided. Do not invent client information or silently add future features to the MVP.

## 1. Project overview

Willy Nilly brings multiple business areas together under one website:
1. Guest House
2. Farm House
3. Resort — upcoming
4. Horticulture — plants and saplings
5. Shop Rental — inactive by default and enabled only by the Administrator

The website has four primary purposes:
- **Introduce:** explain the business, its offerings, and location.
- **Showcase:** present rooms, the Farm House, the upcoming Resort, plants, shops, and photographs.
- **Connect:** accept Guest House booking requests and service/general enquiries.
- **Manage:** let the Administrator update regular website content without relying on a developer.

This is an **information, booking-request, and enquiry website**. Online payment is explicitly outside the current scope.

## 2. User types and access

### Public visitor
Anyone who visits the website. Visitors can browse public content, view rooms and plants, explore the Farm House and upcoming Resort, browse public gallery photos, submit booking requests and enquiries, and receive a request-received confirmation.

The PRD does not require public registration, customer login, customer accounts, or a customer dashboard.

### Administrator
The business owner or an authorised person who manages the site through a private area protected by secure login. The Administrator manages content, room information, booking requests, enquiries, Gallery content, and Shop Rental activation.

The number of Administrator users and different access levels are **To Be Confirmed**.

## 3. Public website pages

### 3.1 Home
Must display:
- Business/brand name.
- Attractive introductory/hero section with a prominent photograph and welcome message.
- Short business description.
- Clear blocks for Guest House, Farm House, Resort (Upcoming), and Horticulture.
- Service highlights.
- Selected photographs with a link to the full Gallery.
- Quick enquiry form or action.
- Phone/email, address, and location details when supplied.
- Clear calls to action such as **Enquire Now**, **Contact Us**, and **Explore**.

Shop Rental must not appear publicly while inactive. A visitor should quickly understand the business and where to go next.

### 3.2 About Us
Display client-provided official business name, introduction, background/story, owner/founder name and photo/profile, vision or purpose, mission if applicable, key highlights, and other relevant information. The Administrator must be able to update this content.

### 3.3 Guest House
Show each room’s:
- Guest House name.
- Multiple photographs.
- Room type (examples in PRD: single, double, family; final types are TBD).
- Features such as bed type, bathroom, and amenities.
- AC / Non-AC.
- Description.
- Price.
- Other Guest House facilities.
- **Book Now** action.
- Optional public availability/status, only if the client wants it.

Room types, room count, exact facilities, price basis (e.g. per night), public price display, and public availability display are **To Be Confirmed**.

A booking is a **request**, not an instant confirmed reservation. Administrator review is required.

### 3.4 Farm House
Promote the property as an open space for events and celebrations. Support:
- Property and surroundings photographs.
- Property description and open-space information.
- Facilities.
- Suitable events: birthdays, weddings, receptions, corporate events, family functions, private celebrations, and other gatherings.
- Event/celebration photographs.
- Location.
- Optional guest capacity if the client wants it shown (TBD).
- **Enquire Now** action leading to an event enquiry form.

The Administrator manages property information, photographs, facilities, event information, and enquiries.

### 3.5 Resort — Upcoming
This is a promotional page only:
- Resort name when supplied.
- Prominent **Launching Soon** message.
- Resort photographs, artist impressions, design/site visuals.
- Celebration/lifestyle visuals.
- Concept/presentation text.
- Planning/development visuals supplied by the engineer/designer.
- Other relevant upcoming-property information.

Clearly state that the Resort is not yet available for normal booking. Resort booking remains disabled until the client officially decides to launch it and approves the scope change.

### 3.6 Horticulture
Show currently available plants, saplings, and other relevant items. Each listing supports:
- Name.
- Photograph.
- Short description.
- Price.
- Availability/status.
- Other useful details, such as size or care notes.

Visitors can enquire about purchase or collection. Online ordering, checkout, payment, and delivery are not in the MVP. Item list, prices, availability, and price basis (e.g. per piece) are TBD.

### 3.7 Shop Rental
Shop Rental is linked to the Guest House/category navigation in the PRD but is **inactive by default**.

When active, a shop listing supports:
- One or more photographs.
- Size in square feet.
- Rental price and rent period.
- Description.
- Location/details.
- Availability.
- Enquiry action.

The rent period (monthly or another period) is TBD.

Administrator can activate/deactivate Shop Rental and manage shop details. When inactive, Shop Rental must be hidden from navigation and public pages, and public shop enquiries must be disabled. When activated, available shops are shown and visitors can enquire. Deactivation must disable public visibility and enquiry flow, including server-side endpoints—not merely hide a button.

### 3.8 Gallery
Public visitors can browse all public photographs or filter by category/album and open a photo in a larger view.

Possible photo groups listed in the PRD:
- Guest House
- Farm House
- Events
- Resort / upcoming Resort
- Horticulture
- Property
- Celebrations
- Other business photos

Administrator can upload, remove, update, organise photos into categories/albums, and choose which photos are public. Initial album names and photo counts are TBD.

### 3.9 Contact Us
Display supplied business name, postal address, location, phone number(s), official email, additional contact details if supplied, business hours if applicable, and a map/location guide. Include a short contact/enquiry form. The Administrator can update contact details. Business hours are TBD.

### 3.10 General Enquiry
Provide a general enquiry option for needs not covered by a specific service. Generally collect name, mobile, email, enquiry type, and message. Store submissions for Administrator review and follow-up. Exact fields and statuses are TBD.

## 4. Guest House booking-request workflow

### Required fields
- Guest name — required.
- Mobile number — required.
- Email address — required.
- Check-in date — required.
- Check-out date — required.
- Number of guests — required.
- Selected room — chosen from available/public rooms.
- Number of rooms — required.
- Special request/message — optional.

### Workflow
1. Visitor opens Guest House.
2. Visitor reviews room details, photos, features, and price.
3. Visitor selects a room and clicks **Book Now**.
4. Visitor submits the booking-request form.
5. Website confirms the request was received.
6. Request is saved and appears in the private Administrator area.
7. Administrator reviews the request and updates its status.
8. Administrator contacts the guest using the provided details.

### Suggested statuses in the PRD
- **New** — just received.
- **Under Review** — checking availability.
- **Confirmed** — Administrator accepts.
- **Declined** — cannot be accepted.
- **Cancelled** — cancelled.

The final status list is TBD. Booking submission does not confirm a reservation automatically. Online payment is not included. The PRD does not require live availability calendars or automatic inventory locking; do not claim guaranteed availability unless separately implemented and tested.

## 5. Enquiries

### Sources
- Farm House — event and celebration enquiries.
- Horticulture — plant/sapling enquiries.
- Shop Rental — only when active.
- Contact Us / Home — general messages.
- Other business services — relevant general enquiries.

### Fields by type

**Farm House event enquiry**
- Name, mobile, email, event type, preferred date, expected guest count, requirements, message.

**Horticulture enquiry**
- Customer name, mobile, email, selected plant/sapling, quantity, message/requirement.

**Shop Rental enquiry**
- Name, mobile, email, selected shop, message/requirement.

**General enquiry**
- Name, mobile, email, enquiry type, message.

Enquiries should retain their source/type and submitted information so the Administrator can follow up.

### Administrator enquiry handling
- View enquiry list and details.
- View customer contact details, enquiry type, selected service/item, and requirements.
- Track follow-up status.

The PRD gives **New → Contacted → Closed** as example statuses; the final list is TBD. Email or phone alerts for new requests are also TBD and must not be assumed to be included.

## 6. Administrator management area

The management area is private and protected by secure login.

### Business information
Manage business name, About Us content, owner details, contact details, address/location, and other business information.

### Guest House
Manage room information, photos, types, AC/Non-AC, features, prices, any agreed public availability information, booking requests, and booking statuses.

### Farm House
Manage property information, photographs, facilities, event information, and enquiries.

### Resort
Manage Resort information, Launching Soon content, photos, engineer/designer/planning visuals, and upcoming status. This must not activate Resort bookings.

### Horticulture
Manage plant/sapling details, photos, descriptions, prices, availability, and related enquiries.

### Shop Rental
Activate/deactivate the module; manage shops, photos, size, rental price/period, location, information, availability, and related enquiries.

### Gallery
Upload/remove/update photos, organise categories/albums, and choose which photos are publicly visible.

### Enquiries
View enquiries, customer details, type, requirements, and follow-up status.

The PRD does not settle the number of Administrator accounts or role/access levels.

## 7. Navigation and visitor journeys

### Suggested navigation
- Home
- About Us
- Categories:
  - Guest House
  - Shop Rental (only when active)
  - Farm House
  - Resort — Upcoming
  - Horticulture
- Gallery
- Contact Us
- Enquiry

The final navigation may be adjusted with client approval.

### Main journeys
- **Guest House:** Home → Guest House → Select Room → View Photos/Features/Price → Submit Booking Request → Administrator receives request.
- **Farm House:** Home → Farm House → View Property → Event Enquiry → Submit → Administrator receives enquiry.
- **Horticulture:** Home → Horticulture → Select Plant/Sapling → View Photo/Price → Submit Enquiry → Administrator follows up.
- **Shop Rental:** Administrator activates → adds shop details/photos/size/rent → listing becomes public → visitor views shop → submits enquiry → Administrator receives enquiry.
- **Gallery:** Visitor opens Gallery → browses all or category/album → opens larger view.
- **General enquiry:** Visitor opens Home/Contact/Enquiry → completes form → submits → Administrator reviews/follows up.

## 8. Business rules that must be enforced

1. Guest House rooms show details, photos, AC/Non-AC options, and prices.
2. Visitors can submit Guest House booking requests.
3. Booking requests go to the Administrator for review.
4. Farm House has an event/celebration enquiry option.
5. Resort is displayed as **Launching Soon**.
6. Resort booking remains unavailable until official launch and approval.
7. Horticulture items show photos and prices with an enquiry option.
8. Shop Rental remains inactive unless activated by the Administrator.
9. Administrator can manage shops after activation.
10. Visitors can enquire about shops only while Shop Rental is active.
11. Administrator manages Gallery photographs and public visibility.
12. Administrator can manage business/contact information.
13. Online payments are not included in current scope.
14. A visitor does not need an account according to the PRD.
15. A booking request must not be represented as confirmed before Administrator approval.

## 9. Responsive and user experience requirements

The website should work on mobile phones, tablets, and desktop/laptop computers. It should provide:
- Simple navigation.
- Easy-to-complete booking and enquiry forms.
- Attractive photographs that load quickly.
- Important contact information easy to find.
- Professional, trustworthy, consistent appearance.
- Clear calls to action such as **Book Now**, **Enquire Now**, and **Contact Us**.

Preferred colours, design references, languages, and visual style must be supplied or confirmed.

## 10. Client content required

The PRD requests:
- Official business name and logo.
- Business introduction, background, vision, and mission.
- Owner/founder name, photograph, and profile.
- Address, phone number(s), email, business hours, and map/location.
- Guest House name, room list/types, AC/Non-AC, features, prices, facilities, photos.
- Farm House description, open-space details, facilities, capacity, event types, photos, location.
- Resort name, concept text, planning/design visuals, lifestyle images, launch message.
- Horticulture item list, names, photos, descriptions, prices, availability.
- Shop details, size, rent, and photos when ready to activate.
- High-quality photos grouped by category.
- Preferred colours, reference websites, and website languages.

## 11. Open decisions explicitly marked “To Be Confirmed”

1. Official business/brand name.
2. Owner details to show on About Us.
3. Complete contact details and business hours.
4. Final navigation menu and page names.
5. Guest House room types, room count, and features.
6. Room price basis and whether prices are public.
7. Whether room availability/status is displayed.
8. Additional booking form fields.
9. Final booking statuses.
10. Farm House capacity and facilities to display.
11. Resort name, launch timeline, and visuals.
12. Horticulture item list, prices, and availability display.
13. Shop Rental details, rent period, and activation timing.
14. Gallery albums/categories.
15. Enquiry fields and follow-up statuses.
16. Whether email/phone alerts are sent for new requests.
17. Number of Administrator users and access levels.
18. Website language(s).
19. Preferred colours, design style, and reference websites.

Make suitable settings configurable where practical. Document unresolved decisions and never fabricate client data.

## 12. Current MVP scope

### Included
- Home, About Us, Guest House, Farm House, Resort (Upcoming), Horticulture, Gallery, Contact Us, and Enquiry pages.
- Shop Rental linked to the Guest House/category navigation, inactive by default and activated by Administrator.
- Guest House room display with photos, AC/Non-AC, features, and prices.
- Guest House booking-request form delivered to Administrator.
- Farm House, Horticulture, Shop Rental (when active), and general enquiry forms.
- Resort Launching Soon promotional page.
- Gallery with categories/albums.
- Private Administrator area to manage content, booking requests, and enquiries.
- Responsive mobile/tablet/desktop design.

### Not included
- Online payment for rooms, events, plants, or shop rent.
- Resort booking before official launch.
- Features/pages not mentioned in the PRD unless agreed separately in writing.

## 13. Future expansion — not MVP commitments

The PRD lists these as possible future additions:
- Online payments.
- Resort booking after launch.
- Live Guest House availability calendar.
- Online Horticulture ordering and delivery.
- Customer reviews/testimonials.
- Additional languages.
- Offers, seasonal packages, and event packages.
- Customer message/email notifications when a request is confirmed.
- Additional business categories.

Do not implement these as MVP features without separate approval.

## 14. Suggested data entities (implementation interpretation)

The PRD describes functionality, not mandatory database model names. The following is a practical mapping:
- **Admin** — administrator authentication.
- **SiteSettings / BusinessInfo** — business details, contact information, location, configurable module visibility.
- **Room** — room content, photos, features, AC/Non-AC, price, agreed public availability data.
- **BookingRequest** — guest details, dates, guest count, selected room, room count, optional request, status, timestamps.
- **FarmHouseContent** — property details, photos, facilities, events, location, optional capacity.
- **ResortContent** — upcoming status, launch message, description, images.
- **Plant / HorticultureItem** — name, image, description, price, availability, extra details.
- **ShopRentalSettings** — module active/inactive state.
- **ShopRentalListing** — photos, size, rent/period, description, location, availability.
- **Enquiry** — source/type, contact details, selected item/service, preferred date if applicable, requirements/message, status, timestamps.
- **GalleryAlbum / GalleryImage** — album/category, image metadata, ordering, public visibility.

Exact schema fields, indexes, image storage provider, and technical architecture are implementation decisions and must preserve the business rules above.

## 15. Acceptance checklist

- [ ] Home introduces the business and links to categories.
- [ ] Administrator can update About Us and business details.
- [ ] Guest House rooms show agreed details and booking action.
- [ ] Booking form contains all required fields and confirms receipt.
- [ ] Requests appear in the Administrator area and statuses can be updated.
- [ ] Farm House content and event enquiries work.
- [ ] Resort displays Launching Soon and has no booking flow.
- [ ] Horticulture listings and enquiries work; no online checkout/payment.
- [ ] Shop Rental is hidden by default.
- [ ] Activating Shop Rental exposes configured listings and enquiries.
- [ ] Deactivating Shop Rental disables public listings and enquiries.
- [ ] Gallery supports categories/albums, larger photo view, and admin visibility controls.
- [ ] Contact Us shows supplied details and accepts messages.
- [ ] General enquiries are stored and available to the Administrator.
- [ ] Admin can manage all content areas specified in the PRD.
- [ ] No customer account/login feature has been added without approval.
- [ ] No online payment or Resort booking has been added without approval.
- [ ] Website works on mobile, tablet, and desktop.
- [ ] Every unresolved client decision is documented rather than invented.

## 16. Technical implementation guidance (not PRD-mandated)

If the agreed implementation is Next.js with JavaScript and MongoDB:
- Use Next.js App Router.
- Use JavaScript `.js` / `.jsx`, not TypeScript `.ts` / `.tsx`.
- Keep `src/` as the source root and package/configuration files at the project root.
- Use `src/app/` for pages and server Route Handlers.
- Use `src/api/` only for frontend API request modules.
- Keep server-only controllers, services, repositories, validation, authentication, and database access in a server-only backend layer.
- Use MongoDB for persistent content, booking requests, and enquiries.
- Apply secure Administrator authentication, server-side authorization, validation, abuse protection, safe image handling, logging, backups, and automated tests.

These are technical recommendations, not requirements explicitly mandated by the business PRD.

## Source note

This document is derived from the supplied *Business Website – Product Requirements Document*, Version 1.0, dated October 2026 (25 pages). The source includes sections on project overview, objectives, target visitors, website structure, Home, About Us, categories, Gallery, bookings, enquiries, Contact Us, Administrator management, business rules, user journeys, client content, pending decisions, scope, and future expansion.
