#!/usr/bin/env python
# coding: utf-8

# ## 자연어 처리기로 데이터 셋 만들기

# In[1]:


# 데이터 핸들링 프레임
import numpy as np 
import pandas as pd
from pandas import DataFrame as df
import csv
import os

# 자연어 처리기
from konlpy.tag import Okt
from collections import Counter


# In[9]:


# 데이터 전처리 모델
class getDescTags(dataset):
    def __init__(self, n, dataset):
        self.n = len(dataset)
        self.dataset = dataset
        
    # 1) description 다듬기 : 데이터 정규화, 맥락 위주로 자르고 명사만 가져오기, 글자길이는 1 ~ 7  
    def getDescList(n):
        okt=Okt()
        descList=[]
        for i in range(n):
            tempList=[]
            descript=(dataset.description[i]) # 한글자 이상만 뽑음
            descript=descript.replace("\n","")
            descript=descript.replace("\r","")
            descript=descript.replace("[^ㄱ-ㅎㅏ-ㅣ가-힣AZ09]","")
            tempList=[j[0] for j in okt.pos(descript) if ((len(j[0])>1)& (len(j[0])<7)& (j[1]=="Noun"))]
            tempList=list(set(tempList))
            if len(tempList)>0:
                descList.append(tempList)
            else:
                descList.append(tempList)
        return descList
    
    
    ## 2) Tag 다듬기 : 복합명사로 이루어진 태그는 잘라서 길이 2~7 사이의 단어만 추출
    def getTagList(n):
        parseTagList=[]
        okt=Okt()
        for i in range(n):
            tempTagList=[]
            tags=str(dataset.tag[i]).split('#') # 태그별로 자르기
            for tag in tags:
                if len(tag)>1:
                    okt.pos(tag)  # 1개 태그 내 복합 명사 자르기
                    for j in okt.nouns(tag):
                        if(len(j)>=2|len(j)<7):
                            tempTagList.append(j)
            tempTagList=list(set(tempTagList))
            parseTagList.append(tempTagList)
        return parseTagList

    
    ## 3-1) 코어 태그 추출 (태그, description 합집합)
    def getCoreTags1(n):
        coreTagList1=[]
        okt=Okt()    
        coreTag=[]
        descript=getDescList(self.n) # 한글자 이상만 뽑음
        tags=getTagList(n)  # tag를 한번 더 파싱
        for i in range(len(descript)): 
            if (len(tags[i])>0): 
                coreTag.append(tags[i]+descript[i])
            else:
                coreTag.append(descript[i])
        coreTagList1.append(coreTag)
        CoreTagData1=getCoreTags1(len(dataset))
        CoreTagData1=CoreTagData1[0]
        return CoreTagData1
    
    
    ## 3-2) 코어 태그 추출 (부분적으로 기존 태그 + description + coreTag )
    def getCoreTags2(n):
        coreTagList=[]
        okt=Okt()    
        descript=getDescList(self.n) # 한글자 이상만 뽑음
        tags=getTagList(self.n)  # tag를 한번 더 파싱
        for k in range(len(descript)):
            coreTags=[]
            for t in range(len(tags[k])):
                if (len(tags[k][t])>0)&(tags[k][t] in descript[k]): # 태그가 description 단어에도 있는지 확인
                    coreTags.append(tags[k][t])
            if (len(tags[k])<=3): # 태그 수가 없으면 디스크립션으로
                coreTagList.append(list(set(descript[k])))
            elif((len(coreTags)<=3)&(len(tags[k])>3)):# desc와 일치하는 태그(coreTag)가 적은데 기존 태그(tags[k])많으면 기존 태그 사용
                coreTagList.append(tags[k])
            elif(len(coreTags)>3): # 디스크립션과 일치하는 태그가 많으면 일치태그 사용
                coreTagList.append(coreTags)
            else:
                coreTagList.append(list(set(descript[k]))) 
        return coreTagList

    
    # Tag2 데이터 보정 : Tag1의 데이터 갖다쓰기
    def fillCoreTag():
        for i in range(len(CoreTagDate2)):
            if len(CoreTagDate2[i])<1:
                CoreTagDate2[i]=(CoreTagData1[i])

        for i in range(len(CoreTagDate2)):
            CoreTagDate2[i]=list(set(CoreTagDate2[i]))
            CoreTagData1[i]=list(set(CoreTagData1[i]))
            
        return CoreTagData1,CoreTagDate2


# In[ ]:





# In[ ]:



