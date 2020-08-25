-- select
SELECT
s.stu_id, s.name, s.description, s.main_img,
s.category,
s.weekday, s.time,
s.start_date, s.end_date,
f.unit_price, f.tag,
ifnull((r.score),0) avg
FROM (
SELECT
s.stu_id, s.name, s.description, s.main_img,
c.category,
r.weekday, r.time,
e.start_date, e.end_date
FROM studio s
LEFT OUTER JOIN repeat_date r
ON s.stu_id = r.stu_id
LEFT OUTER JOIN exception_date e
ON s.stu_id = e.stu_id
LEFT OUTER JOIN studio_category c
ON s.category_id = c.category_id
) s
LEFT OUTER JOIN 
(SELECT 
f.unit_price, f.stu_id, t.tag
FROM studio_filter f
JOIN tag_dic t
ON f.filter_id = t.filter_id) f
ON f.stu_id = s.stu_id
LEFT OUTER JOIN review r
ON s.stu_id = r.stu_id
WHERE s.stu_id
GROUP BY s.stu_id;

SELECT
s.stu_id, s.name, s.description, s.main_img,
c.category_name,
r.weekday, r.time,
e.start_date, e.end_date,
t.tag
FROM studio s
LEFT OUTER JOIN repeat_date r
ON s.stu_id = r.stu_id
LEFT OUTER JOIN exception_date e
ON s.stu_id = e.stu_id
LEFT OUTER JOIN studio_category c
ON s.category_id = c.category_id
LEFT OUTER JOIN tag_dic t
ON t.stu_id = s.stu_id
ORDER BY stu_id;

select * from tag_dic;

SELECT
s.stu_id, s.name, s.description, s.main_img,
c.category_id, c.category_name,
com.name com_name,
r.weekday,
e.start_date, e.end_date,
t.tag_name,
f.unit_price, f.address,
ifnull(rv.avg,0) avg,
ifnull(res.count,0) count
FROM studio s
JOIN company com
ON s.com_id = com.com_id
JOIN studio_filter f
ON s.stu_id = f.stu_id
LEFT JOIN studio_category c
ON s.category_id = c.category_id
LEFT OUTER JOIN repeat_date r
ON s.stu_id = r.stu_id
LEFT OUTER JOIN exception_date e
ON s.stu_id = e.stu_id
LEFT OUTER JOIN tag t
ON s.stu_id = t.stu_id
LEFT OUTER JOIN
(SELECT
stu_id, AVG(score) avg
FROM review
GROUP BY stu_id
) rv
ON s.stu_id = rv.stu_id
LEFT OUTER JOIN
(SELECT
stu_id, COUNT(stu_id) count
FROM reservation
GROUP BY stu_id
) res
ON s.stu_id = res.stu_id
WHERE 
c.category_id = 3
AND (s.name Like '%서울%'
OR c.category_name Like '%서울%'
OR s.description Like '%서울%'
OR t.tag_name Like '%서울%'
OR f.address Like '%서울%'
OR com.name Like '%서울%')
group by s.stu_id
ORDER BY s.stu_id DESC;

select * from studio;
select * from exception_date;
;
select * from studio_category;
insert into tag(stu_id, tag_name) VALUES(10, '이태원');
select e.stu_id, e.start_date from exception_date e RIGHT OUTER JOIN studio s on e.stu_id = s.stu_id where start_date = '2020-08-30';
-- "../assets/img/studio/1_스튜디오.jp-- 
update studio set main_img ="../assets/img/studio/1_스튜디오.jpg" where stu_id =10;
update studio set main_img ='../assets/img/studio/1_카페식당.jpg' where stu_id =11;
update studio set main_img ='../assets/img/studio/1_사무실.jpg' where stu_id =12;
update studio set main_img ='../assets/img/studio/1_그-외-장소.jpg' where stu_id =13;
update studio set main_img ='../assets/img/studio/1_펜션.jpg' where stu_id =14;
update studio set main_img ='../assets/img/studio/3_카페식당.jpg' where stu_id =15;
update studio set main_img ='../assets/img/studio/3_스튜디오.jpg' where stu_id =16;
update studio set main_img ='../assets/img/studio/2_스튜디오.jpg' where stu_id =17;
update studio set main_img ='../assets/img/studio/1_옥상.jpg' where stu_id =18;
update studio set main_img ='../assets/img/studio/2_카페식당.jpg' where stu_id =19;
