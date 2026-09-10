insert into products (name,slug,category,short_description,description,applications,industries,keywords) values
('Industrial Hardware','industrial-hardware','Products','Industrial components and material solutions for requirements.','NT Enterprises supplies industrial hardware. Contact the team with the application and required specification for confirmation.','Industrial requirements','Industrial Manufacturing',array['hardware','industrial']),
('Packaging Material','packaging-material','Products','Materials for packaging requirements.','NT Enterprises supplies packaging material. Share the handling, transit or storage requirement to discuss the appropriate material.','Packaging requirements','Packaging Industry',array['packaging','material']),
('Flexographic Printing Machines','flexographic-printing-machines','Products','Solutions for flexographic printing operations.','NT Enterprises provides flexographic printing machine solutions. Machine requirements should be confirmed with the team.','Flexographic printing','Printing Industry',array['flexographic','printing','machine']),
('Doctor Blades','doctor-blades','Products','Doctor blade solutions for printing applications.','NT Enterprises provides doctor blades for flexographic printing applications. Submit machine and application details for guidance.','Flexographic printing','Flexible Packaging, Printing Industry',array['doctor blade','flexo','printing']),
('Side Packing Foam','side-packing-foam','Products','Foam solutions for packing requirements.','NT Enterprises supplies side packing foam for packing requirements.','Packing','Packaging Industry',array['foam','packing']),
('Diaphragms','diaphragms','Products','Diaphragm solutions for industrial applications.','NT Enterprises supplies diaphragms for industrial applications. Share the application for confirmation.','Industrial applications','Industrial Manufacturing',array['diaphragm']),
('Ceramic Rollers','ceramic-rollers','Products','Roller solutions for industrial processes.','NT Enterprises supplies ceramic rollers for relevant industrial processes.','Industrial processes','Industrial Manufacturing',array['ceramic','roller']),
('Woven Sack Technical Consultancy','woven-sack-technical-consultancy','Services','Technical guidance for woven sack manufacturing.','NT Enterprises offers woven sack technical consultancy. Describe the process requirement to start a discussion.','Woven sack manufacturing','Woven Sack Manufacturing',array['woven sack','consultancy'])
on conflict (slug) do nothing;

insert into faqs (question,answer,category,keywords) values
('How can I request a quote?','Share the product or requirement, quantity, application and available technical details using the quote form or NT Assist.','Enquiries',array['quote','enquiry']),
('What information should I include?','Include the product or application, quantity, machine or process information and any technical requirement you already have.','Enquiries',array['requirement','application']) on conflict do nothing;

-- Generate embeddings server-side using lib/gemini.js, then insert each approved product/FAQ summary into knowledge_chunks. Do not insert placeholder vectors.
