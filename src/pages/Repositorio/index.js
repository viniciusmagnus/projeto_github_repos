import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Container, BackButton, Owner, Loading, IssuesList, PageActions, FilterList } from './styles';
import { Link } from 'react-router-dom';
import {FaArrowLeft} from 'react-icons/fa';
import axios from 'axios';



export default function Repositorio(){

    const { '*': endpoint } = useParams();

    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        {state: 'all', label: 'Todas', active: true},
        {state: 'open', label: 'Abertas', active: false},
        {state: 'closed', label: 'Fechadas', active: false},
    ])
    const [filterIndex, setFilterIndex] = useState(0);


    useEffect(()=> {

        async function load(){
            const nomeRepo = decodeURIComponent(endpoint);

            const [repositorioData,issuesData ] = await Promise.all([
                axios.get(`https://api.github.com/repos/${nomeRepo}`),
                axios.get(`https://api.github.com/repos/${nomeRepo}/issues`, {
                    params:{
                        //usando o find para definir o estado ativo apenas o que começar true, no caso o "Todas"
                        state: filters.find(f => f.active).state,
                        per_page: 5
                    }
                })
            ]);

            setRepositorio(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        load();

    }, [filters, endpoint]);

    useEffect(()=>{

        async function loadIssue(){
            const nomeRepo = decodeURIComponent(endpoint);

            const response = await axios.get(`https://api.github.com/repos/${nomeRepo}/issues`, {
                params:{
                    state: filters[filterIndex].state,
                    page,
                    per_page: 5,
                },
            });

            setIssues(response.data);
        }

        loadIssue();

    }, [filterIndex, filters, decodeURIComponent(endpoint), page]);


    function handlePage(action){
        setPage(action === 'back' ? page - 1 : page + 1)
    }

    function handleFilter(index){
        setFilterIndex(index);
    }

    if(loading){
        return(
        <Loading>
            <h1>carregando...</h1>
        </Loading>
        )
        
    }
    

    return(
       <Container>
            <BackButton>
                <Link to="/">
                    <FaArrowLeft color="#000" size={30} />
                </Link>             
            </BackButton>

            <Owner>
                <img 
                src={repositorio.owner.avatar_url} 
                alt={repositorio.owner.login}
                />         

                <h1>
                    {repositorio.name}
                </h1>

                <p>
                    {repositorio.description}
                </p>     
            </Owner>

            <FilterList active={filterIndex}>
                {filters.map((filter, index) => (
                    <button
                    type='button'
                    key={filter.label}
                    onClick={() => handleFilter(index)}
                    >
                        {filter.label}
                    </button>
                ))}
            </FilterList>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login}/>

                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {issue.labels.map(label =>(
                                   <span key={String(label.id)}>{label.id}</span> 
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>

            <PageActions>
                <button 
                type='button' 
                onClick={()=>handlePage('back')}
                disabled={page < 2}
                >Voltar
                </button>

                <button 
                type='button' 
                onClick={()=>handlePage('next')}>
                Próximo
                </button>

            </PageActions>
       </Container>
    )
}