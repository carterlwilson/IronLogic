create
OR REPLACE function
  addNewBenchmarkTemplate(newactivity_id bigint, newtype smallint, notes text, newannotations bigint[]) returns
  BIGINT as $$
declare
  new_id bigint;
declare
  annotation bigint;
BEGIN
  INSERT INTO benchmark_templates(activity_id, type, notes)
  VALUES (newactivity_id, newtype, notes)
  RETURNING id INTO new_id;
 
  FOREACH annotation in ARRAY newannotations
  LOOP
    INSERT INTO benchmark_template_annotations(template_id, annotation_id)
    VALUES (new_id, annotation);
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;