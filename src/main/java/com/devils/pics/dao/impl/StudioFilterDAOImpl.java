package com.devils.pics.dao.impl;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.devils.pics.dao.StudioFilterDAO;
import com.devils.pics.domain.Studio;
import com.devils.pics.domain.StudioFilter;

@Repository
public class StudioFilterDAOImpl implements StudioFilterDAO {

	@Autowired
	private SqlSession sqlSession;
	private final String NS = "StudioFilterMapper.";
	
	/* 스튜디오 공간 등록 관련 메소드 */
	@Override
	public int registerStudioFilter(StudioFilter studioFilter) {
		//StudioFilter 등록
		return sqlSession.insert(NS+"registerStudioFilter", studioFilter);
	}

	@Override
	public List<Studio> searchStudio(HashMap<String, String> filterMap) {
		//Studio 검색
		return sqlSession.selectList(NS+"selectStudioByFilter", filterMap);
	}
	
}
