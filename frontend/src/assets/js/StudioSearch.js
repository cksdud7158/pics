    import axios from "axios";
    import Vue from "vue";
    import { BCollapse } from "bootstrap-vue";
    import { VBToggle } from "bootstrap-vue";

    Vue.directive("b-toggle", VBToggle);
    Vue.component("b-collapse", BCollapse)

    // 요일 변환을 위한 리스트
    const week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    // 카테고리 변한을 위한 리스트
    // Vue 시작
    export default {
        name: "studio-list",
        data() {
            return {
                // Axios 전체 리스트 변수
                studios: [],

                // Axios 필터변수
                filters: {
                    categoryId: "",
                    weekDate: "",
                    selectedDate: "",
                    address1: "",
                    address2: "",
                    minSize: "",
                    maxSize: "",
                    minUnitPrice: "",
                    maxUnitPrice: "",
                    capacity: 0,
                    searchContent: "",
                    searchTag: "",
                    orderCon: "",
                    page: 0
                },
                //로그인 session 변수
                session: 3,

                //별점
                score: 0,

                //collapse 변수
                visible: true,

                //무한스크롤링 변수
                isDone: true, // 검색이 완료되면 동글뱅이 멈춘다
                doSearch: false, //true면 loading 중, false면 끝

                // 기본 변수
                loading: true,
                errored: false
            };
        },
        created() {
            window.addEventListener('scroll', this.handleScroll);
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll);
        },
        mounted() {
            // 페이지 오자마자 전체 리스트 뿌리기 --> 필터 검색 후 진행하도록 
            // this.infiniteHandler();
            // this.filters.page += 5;
            // M.AutoInit();
        },
        filters: {
            // 돈에 , 붙여주는 필터
            currency: function(value) {
                let num = new Number(value);
                return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
            },
            demical: function(value) {
                let num = new Number(value);
                if (num == 0) return 0;
                return num.toFixed(1);
            },
            category: function(value) {
                let str = value.split("시");
                return str[0];
            },
            shortenDesc: function(value) {
                if (value.length > 52) return value.substring(0, 51) + "...";
                return value;
            }
        },
        methods: {
            // 카테고리 설정 메소드
            setCategory() {
                this.filters.categoryId = this.$refs.cataSelect.value;
            },
            // 필터 값 넣고 검색
            setFilter() {
                // 날짜가 입력이 되면 요일 리턴
                if (this.filters.selectedDate.length > 0) {
                    this.weekDate = week[new Date(this.filters.selectedDate).getDay()];
                }
                // #을 입력하면 해시태그 검색으로 전환
                if (this.filters.searchContent.indexOf("#") == 0) {
                    this.filters.searchTag = this.filters.searchContent;
                    this.filters.searchContent = "";
                }
                // 필터를 새로 설정했으므로 페이지와 기존 리스트 0처리
                this.filters.page = 0;
                this.studios = [];

                //필터를 설정하면 collapse 문 닫기
                this.visible = false;

                //로딩 시작
                this.doSearch = true;

                // 필터 객체
                this.infiniteHandler();
                // setTimeout(() => { this.isDone = false; }, 2000)
            },
            //스크롤 이벤트 : 스크롤 바가 맨 밑에 있을 때
            handleScroll() {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.isDone == false) {
                    this.infiniteHandler();
                    this.isDone = true;
                }
            },
            // 검색 메소드(전체 & 필터)
            infiniteHandler() {
                axios
                    .post("http://127.0.0.1:7777/studio/search/filter", this.filters)
                    .then(response => {
                        this.doSearch = true
                        setTimeout(() => {
                            if (response.data) {
                                this.studios = this.studios.concat(response.data);
                                if (response.data.length < 5) {
                                    this.isDone = true;
                                    this.doSearch = false;
                                }
                                this.filters.page += 5;
                                this.isDone = false;
                                this.doSearch = false;

                                // this.closeCol(0);
                            } else {
                                this.isDone = true; // 아무것도 없으면 무한스크롤링 끝낸다
                                this.doSearch = false;
                            }
                        }, 1000)
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            // 상세페이지로 이동
            showStudioInfo(stuId) {
                this.$router.push("/temp/" + stuId);
                alert(stuId);
            },
            // 이미지 경로
            getImgUrl(url) {
                return require("@/assets/img/studio/" + url);
            },
            // 검색 필터 삭제
            initFilter(value) {
                if (value == 1) {
                    this.filters.selectedDate = "";
                    this.filters.weekDate = "";
                } else {
                    this.filters.selectedDate = "";
                    this.filters.weekDate = "";
                    this.filters.addr1 = "";
                    this.filters.addr2 = "";
                    this.filters.minSize = "";
                    this.filters.maxSize = "";
                    this.filters.capacity = 0;
                    this.filters.minUnitPrice = "";
                    this.filters.maxUnitPrice = "";
                    this.filters.page = 0;
                }
                this.infiniteHandler();
            },
            setBookMark($event) {
                let bookmark = {
                    studio: {
                        stuId: $event.target.value
                    },
                    customer: {
                        custId: this.session
                    }
                };
                axios.post("http://127.0.0.1:7777/bookmark", bookmark).then(response => {
                    alert(response.data);
                });
            }
        }
    };