SELECT 
    bt.id as id,
    bt.type as type,
    a.name as name,
    bt.notes as notes,
    string_agg(cast(ba.id as text), ',') as annotations
FROM benchmark_templates bt
LEFT JOIN 
    activities a ON bt.activity_id = a.id
LEFT JOIN 
    benchmark_template_annotations bta ON bt.id = bta.template_id
LEFT JOIN 
    benchmark_annotations ba ON bta.annotation_id = ba.id
GROUP BY 
    bt.id, a.name
