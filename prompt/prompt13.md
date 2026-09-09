링크 테이블과 폴더 테이블을 연결해줘

- 링크 테이블에 folder_id라는 컬럼을 추가해줘
- folder_id 컬럼은 선택적 컬럼으로 설정해줘
- folder_id 컬럼은 folder 테이블의 id 컬럼을 참조하도록 외래키로 설정해줘
- folder 테이블의 데이터가 삭제될 경우(폴더 삭제) 연결된 link 테이블의 folder_id를 빈값으로 설정해줘
