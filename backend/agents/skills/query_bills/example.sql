-- All unpaid bills
SELECT * FROM bill WHERE paid = 0;

-- All paid bills
SELECT * FROM bill WHERE paid = 1;

-- Bills by group
SELECT * FROM bill WHERE group_id = 1;

-- Total owed (unpaid)
SELECT SUM(value) FROM bill WHERE paid = 0;

-- Total paid
SELECT SUM(value) FROM bill WHERE paid = 1;

-- Bills with a due date this month
SELECT * FROM bill WHERE strftime('%Y-%m', term) = strftime('%Y-%m', 'now');

-- Overdue bills (unpaid and past due date)
SELECT * FROM bill WHERE paid = 0 AND term < date('now');

-- Bills with no due date
SELECT * FROM bill WHERE term IS NULL;

-- All groups with their bill count
SELECT g.name, COUNT(b.id) as bill_count 
FROM "group" g 
LEFT JOIN bill b ON b.group_id = g.id 
GROUP BY g.id;